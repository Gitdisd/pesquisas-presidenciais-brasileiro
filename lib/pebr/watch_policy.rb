# frozen_string_literal: true

require "uri"
require "set"

module Pebr
  # Port of useful patterns from pesquisas-eleitorais-br scripts/discover-policy.mjs
  # (canonicalize URL, score/reject links). Discovery only — never invents shares.
  module WatchPolicy
    module_function

    SOCIAL_HOSTS = /(?:whatsapp\.com|facebook\.com|twitter\.com|x\.com|t\.me|instagram\.com|linkedin\.com)/i
    TRACKING_KEYS = %w[utm_source utm_medium utm_campaign utm_content utm_term fbclid gclid ref referrer].to_set
    EXCLUDED_PATHS = %r{(?:/tag/|/tags/|/autor/|/author/|/categoria/|/category/|/search/|/busca/|/feed/?$|/rss/?$)}i
    NON_PRESIDENTIAL = /(?:governador|governadora|prefeito|prefeita|senado|senador|senadora|deputad[oa]|vereador|vereadora|assembleia|estadual|municipal|capital)/i
    PRESIDENTIAL_SIGNAL = /(?:president(?:e|ial)|presid[eê]ncia|primeiro[-_ ]turno|1[ºo°]?[-_ ]?turno|segundo[-_ ]turno|2[ºo°]?[-_ ]?turno|inten[cç][aã]o[-_ ]de[-_ ]voto|pesquisa[-_ ]eleitoral)/i
    INSTITUTE_SIGNAL = /(?:datafolha|quaest|atlas\s*intel|poder\s*data|poder360|nexus|ideia|futura|gerp|palver|verit[aá]|paran[aá]|indexa|vox\s*brasil|alfa\s*intelig|cnt|mda|realtime|real\s*time\s*big\s*data|ipsos|ipec)/i
    TSE_REGISTRATION_SIGNAL = /\bBR[- ]?\d{4,6}\/2026\b|registro\s+(?:do\s+)?TSE|pesqele/i

    def canonicalize_url(raw)
      u = URI.parse(raw.to_s.strip)
      u.fragment = nil
      if u.query
        params = URI.decode_www_form(u.query).reject do |k, _|
          key = k.to_s.downcase
          TRACKING_KEYS.include?(key) || key.start_with?("utm_")
        end
        u.query = params.empty? ? nil : URI.encode_www_form(params)
      end
      u.to_s
    rescue URI::InvalidURIError, ArgumentError
      raw.to_s.strip
    end

    # Returns { url:, score:, rejected:, reasons: [] }
    def classify_poll_link(url, title = "")
      canonical = canonicalize_url(url)
      hay = "#{canonical} #{title}".downcase
      score = 0
      reasons = []
      rejected = false

      begin
        host = URI.parse(canonical).host.to_s
        if SOCIAL_HOSTS.match?(host)
          rejected = true
          reasons << "social"
        end
      rescue URI::InvalidURIError
        # ignore
      end

      if EXCLUDED_PATHS.match?(hay)
        rejected = true
        reasons << "generic-route"
      end

      # Wrong-office always wins: hub paths like /pesquisa-eleitoral-2026/ must not
      # keep "pesquisa-governador-*" links just because the section slug looks presidential.
      if NON_PRESIDENTIAL.match?(hay)
        rejected = true
        reasons << "wrong-office"
      end

      if PRESIDENTIAL_SIGNAL.match?(hay)
        score += 40
        reasons << "presidential-signal"
      end

      if INSTITUTE_SIGNAL.match?(hay)
        score += 35
        reasons << "institute"
      end

      if TSE_REGISTRATION_SIGNAL.match?(hay)
        score += 12
        reasons << "tse-registration-signal"
      end

      if /\.(?:pdf|html?)(?:\?|$)/i.match?(canonical)
        score += 8
        reasons << "document"
      end

      # Google News / Wikipedia are signals, not primary witnesses — keep but downrank
      if /news\.google|wikipedia\.org/i.match?(canonical)
        score -= 15
        reasons << "aggregator-signal"
      end

      { url: canonical, score: score, rejected: rejected, reasons: reasons }
    end

    def keep_link?(url, title = "", min_score: 35)
      c = classify_poll_link(url, title)
      return false if c[:rejected]
      return true if c[:score] >= min_score
      return true if /\.pdf(?:\?|$)/i.match?(c[:url])

      hay = "#{c[:url]} #{title}".downcase
      /pesquisa|inten[cç]|eleitoral|presiden|1[oº].?turno|2[oº].?turno/.match?(hay)
    end
  end
end
