// Load bibliography data from HTML into efficient and easy-to-use Javascript structures
function ParseBibliography()
{
    console.log("Parsing bibliography...");
    bibliography = {};
    $('.tei_front .listBibl li').each(function(i)
    {
        // console.log('Loading ' + $(this).attr('id') + ': ' + $('.author', $(this)).text());
        var quoteType = $(this).closest('.listBibl').data('type');

        var authorEl = $('.author', $(this));
        if ($('.persName', $(this)).length)
            authorEl = $('.persName', $(this));

        var bib = {
           type:   quoteType,
           author: $(authorEl).text(),
           title:  $('.titlem', $(this)).first().text(),
        };
        var link = $('.link_ptr', $(this));
        if (link) {
          bib.link = link.attr('href');
        }
        bibliography[$(this).attr('id')] = bib;
    });
}

function AttachTooltip(topQuoteEl, quotes)
{
    var quotesFound = 0;
    var tooltip = $('<div/>', { 'class': 'quotes_tooltip' });
    $(quotes).each(function()
    {
        var source = $(this).data('source').replace(/^#/, '');
        var primaryBibRecord = bibliography[source];
        if (typeof primaryBibRecord == 'undefined')
            return;
        quotesFound++;

        var quoteWrapper = $('<div/>', { 'class': 'quote_wrapper' });
        tooltip.append(quoteWrapper);

        quoteWrapper.append($('<p/>', {
           'class': 'text',
           text: $(this).text()
        }));

        // PRIMARY BIBLIOGRAPHY

        var primaryBibEl = $('<p/>', { 'class' : 'primary_bib' });
        quoteWrapper.append(primaryBibEl);

        if ('author' in primaryBibRecord)
            primaryBibEl.append($('<span/>', {
                'class': 'author',
                text: primaryBibRecord.author
            }));

        if ('author' in primaryBibRecord && 'title' in primaryBibRecord)
            primaryBibEl.append(', ')
        
        if ('title' in primaryBibRecord)
            primaryBibEl.append($('<span/>', {
                'class': 'title',
                text: primaryBibRecord.title
            }));

        var pageno = $(this).data('n')
        if (typeof pageno != 'undefined')
            primaryBibEl
                .append(', ')
                .append($('<span/>', {
                    'class': 'pageno',
                    text: pageno
                }));

        // SECONDARY BIBLIOGRAPHY

        var ana = $(this).data('ana');
        var secondaryBibRecord;
        if (typeof ana != 'undefined')
            secondaryBibRecord = bibliography[ana.replace(/^#/, '')];
        if (typeof secondaryBibRecord != 'undefined')
        {
            var secondaryBibEl = $('<p/>', { 'class' : 'secondary_bib' });
            quoteWrapper.append(secondaryBibEl);

            secondaryBibEl.append($('<span/>', { text: "Noted in: " }));

            if ('author' in secondaryBibRecord)
                secondaryBibEl.append($('<span/>', {
                    'class': 'author',
                    text: secondaryBibRecord.author
                }));

            if ('author' in secondaryBibRecord && 'title' in secondaryBibRecord)
                secondaryBibEl.append(', ')

            if ('title' in secondaryBibRecord)
                secondaryBibEl.append($('<span/>', {
                    'class': 'title',
                    text: secondaryBibRecord.title
                }));
        }
    });

    $(".quote_wrapper:not(:last-of-type)", $(tooltip)).after("<hr/>");

    $(topQuoteEl).tooltipster({ content: quotesFound > 0 ? tooltip : $('<span>No bibliography found here</span>') });
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

// Add a CSS class to the quote based on its bibliography type (e.g. GermanLit)
function AddQuoteTypeCssClasses(topQuoteEl, quotes)
{
    $(quotes).each(function()
    {
        var source = $(this).data('source').replace(/^#/, '');
        var primaryBibRecord = bibliography[source];
        if (typeof primaryBibRecord != 'undefined')
            $(topQuoteEl).addClass(primaryBibRecord.type);
    });
}

function HideTocElements()
{
    $('.toc a[href="#ds2"]').parent().hide();
    $('.toc a[href="#ds3"]').parent().hide();
}

function GenerateClickFunction(quoteEl, bibRecord)
{
  var url = bibRecord.link;
  var anchor = $(quoteEl).data('base');

  if (typeof anchor == 'undefined')
    anchor = $(quoteEl).data('n');
  if (typeof anchor != 'undefined')
    url += anchor;

  return function() { $('#external-text').attr('src', url); };
}

function AttachClick(topQuoteEl, quotes)
{
  if (quotes.length == 1)
  {
    var source = $(topQuoteEl).data('source').replace(/^#/, '');
    var bibRecord = bibliography[source];
    if (typeof bibRecord == 'undefined' || typeof bibRecord.link == 'undefined')
      return null;
    $(topQuoteEl).click(GenerateClickFunction(topQuoteEl, bibRecord));
    return;
  }

  // Multiple quotes, attach a context menu
  var menu = [];
  $(quotes).each(function()
  {
    var source = $(this).data('source').replace(/^#/, '');
    var bibRecord = bibliography[source];
    if (typeof bibRecord == 'undefined' || typeof bibRecord.link == 'undefined')
      return null;

    var text = "";
    if ('author' in bibRecord)
      text += bibRecord.author;

    if ('author' in bibRecord && 'title' in bibRecord)
      text += ", ";
        
    if ('title' in bibRecord)
      text += bibRecord.title;

    var pageno = $(this).data('n')
    if (typeof pageno != 'undefined')
      text += ", " + pageno;
   
    var menuItem = {};
    menuItem[text] = GenerateClickFunction(this, bibRecord);
    menu.push(menuItem);
  });

  $(topQuoteEl).contextMenu(menu, {
    beforeShow: function() { $(topQuoteEl).tooltipster('hide'); }
  });
}


$(document).ready(function()
{
    HideTocElements();
    ParseBibliography();
    
    // TODO: Pass over all quotes to make sure there are no unresolved quotes?
    
    $('.quote').each(function(i)
    {
        // Skip nested quotes, they will be handled by their parents
        if ($(this).parents('.quote').length > 0)
           return;

        var allQuotes = $('.quote', $(this))
          .add(this)
          .filter('[data-source]');

        AddQuoteTypeCssClasses(this, allQuotes);
        AttachTooltip(this, allQuotes);

        if (typeof $(this).data('source') == 'undefined') {
            console.log('Quote has no source attribute');
            return;
        }

        AttachClick(this, allQuotes);
   });
    
    AttachSplitPane();
});
