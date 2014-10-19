<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">

    <xsl:import href="lib/tei/html5/html5.xsl"/>

    <xsl:template name="javascriptHook">
        <meta charset="utf-8" />
    </xsl:template>
    
    <xsl:template match="/">
        <xsl:call-template name="processTEI"/>    
    </xsl:template>
    
</xsl:stylesheet>
