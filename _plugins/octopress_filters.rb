#custom filters for Octopress

module OctopressLiquidFilters

  # Extracts raw content DIV from template, used for page description as {{ content }}
  # contains complete sub-template code on main page level
  def raw_content(input)
    /<div class="entry-content">(?<content>[\s\S]*?)<\/div>\s*<(footer|\/article)>/ =~ input
    return (content.nil?) ? input : content
  end

  # Escapes CDATA sections in post content
  def cdata_escape(input)
    input.gsub(/<!\[CDATA\[/, '&lt;![CDATA[').gsub(/\]\]>/, ']]&gt;')
  end

  # Replaces relative urls with full urls
  def expand_urls(input, url='')
    url ||= '/'
    input.gsub /(\s+(href|src)\s*=\s*["|']{1})(\/[^\"'>]*)/ do
      $1+url+$3
    end
  end

end
Liquid::Template.register_filter OctopressLiquidFilters

