<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">

    <xsl:import href="lib/tei/html5/html5.xsl"/>

    <!-- TEI XSL surrounds quotes with ' ' by default -->
    <xsl:param name="preQuote" />
    <xsl:param name="postQuote" />
    
    <!-- Inject some of our own CSS and Javascript directives into the <head> -->
    <xsl:template name="javascriptHook">
        <script type="text/javascript" src="lib/jquery/jquery-2.1.1.min.js">XSL</script>
        <link rel="stylesheet" type="text/css" href="lib/tooltipster/css/tooltipster.css" />
        <script type="text/javascript" src="lib/tooltipster/js/jquery.tooltipster.min.js">XSL</script>        
        
        <script type="text/javascript" src="js/custom.js">XSL</script>
        <link rel="stylesheet" href="css/custom.css" type="text/css" media="screen" />        
    </xsl:template>
    
    <xsl:template match="/">
        <xsl:call-template name="processTEI"/>    
    </xsl:template>
    
</xsl:stylesheet>