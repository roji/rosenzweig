// Load bibliography data from HTML into efficient and easy-to-use Javascript structures
function ParseBibliography()
{
    console.log("Parsing bibliography...");
    bibliography = {};
    $('.tei_front .listBibl li').each(function(i)
    {
        console.log('Loading ' + $(this).attr('id') + ': ' + $('.author', $(this)).text());
        var quoteType = $(this).closest('.listBibl').data('type');
        var bib = {
           type:   quoteType,
           author: $('.author', $(this)).text(),
           title:  $('.titlem', $(this)).text(),
        };
        var link = $('.link_ptr', $(this));
        if (link) {
          bib.link = link.attr('href');
        }
        bibliography[$(this).attr('id')] = bib;
    });
}

function AttachTooltip(quoteEl, bibRecord)
{
    if (typeof bibRecord == 'undefined') {
        $(quoteEl).tooltipster({
            content: $('<span>Source not found in bibliography list: ' + $(quoteEl).data('source') + '</span>')
        });
        return;
    }
    
    var wrapper = $('<div/>', { 'class': 'quote_tooltip' });
    wrapper.append($('<p/>', {
            'class': 'text',
            text: $(quoteEl).text()
    }));
    
    if ('author' in bibRecord)
        wrapper.append($('<span/>', {
            'class': 'author',
            text: bibRecord.author
        }));

    if ('author' in bibRecord && 'title' in bibRecord)
        wrapper.append(', ')
        
    if ('title' in bibRecord)
        wrapper.append($('<span/>', {
            'class': 'title',
            text: bibRecord.title
        }));

    var pageno = $(quoteEl).data('n')
    if (typeof pageno != 'undefined')
        wrapper
            .append(', ')
            .append($('<span/>', {
                'class': 'pageno',
                text: pageno
            }));

    $(quoteEl).tooltipster({ content: wrapper });
}

function AttachLink(quoteEl, bibRecord)
{
  console.log("Attaching link");
  var url = bibRecord.link;
  var anchor = $(quoteEl).data('n');
  if (typeof anchor != 'undefined')
    url += "#" + anchor;
  $(quoteEl).click(function() {
    $('#external-text').attr('src', url);
  });
}

function AttachSplitPane()
{
    var splitPane = $('<div/>', {
        'class': 'split-pane vertical-percent'
    })
      .append($('<div/>', {
        id: 'book-pane',
        "class": 'split-pane-component'
      }).append(
        $('<div/>', {
          id: "book",
          "class" : "pretty-split-pane-component-inner"
        }).append($('body').children().detach())
      ))
      
      .append($('<div/>', {
        id : "divider",
        "class" : "split-pane-divider"
      }))
      
      .append(
        $('<div/>', {
          id: 'external-text-pane',
          "class": 'split-pane-component'
        }).append(
          $('<div/>', {
            "class" : "pretty-split-pane-component-inner"
          }).append($('<iframe/>', {
            id: 'external-text',
            src: ""
          }))
        )
      );
    
    $(splitPane).splitPane();
    
    $('<div/>', {
        'class': 'pretty-split-pane-frame'
    })
      .append(splitPane)
      .appendTo($('body'));
}

$(document).ready(function()
{
    ParseBibliography();
    
    // TODO: Pass over all quotes to make sure there are no unresolved quotes?
    
    $('.quote').each(function(i)
    {
        if (typeof $(this).data('source') == 'undefined') {
            console.log('Quote has no source attribute');
            return;
        }
        var source = $(this).data('source').replace(/^#/, '');
        var bibRecord = bibliography[source];
        if (typeof bibRecord == 'undefined') {
            console.log("Quote has unknown bibliography source: " + $(this).data('source'));
        } else {
            // Add a CSS class to the quote based on its bibliography type (e.g. GermanLit)
            $(this).addClass(bibRecord.type);
        }
        
        AttachTooltip(this, bibRecord);
        if (typeof bibRecord != 'undefined' && typeof bibRecord.link != 'undefined')
          AttachLink(this, bibRecord);
    });
    
    AttachSplitPane();
});
