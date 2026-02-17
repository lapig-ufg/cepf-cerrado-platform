module.exports = function (app) {

    /**
     * Health check PÚBLICO
     * Informações seguras para expor publicamente
     */
    const healthCheckPublic = async (request, response) => {
        try {
            const health = {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: Math.floor(process.uptime()),
                version: process.env.APP_VERSION || 'unknown',
                buildDate: process.env.BUILD_DATE || 'unknown'
            };

            response.status(200).json(health);

        } catch (error) {
            response.status(503).json({
                status: 'unhealthy',
                timestamp: new Date().toISOString()
            });
        }
    };

    /**
     * Health check DETALHADO - apenas rede interna
     * Informações sensíveis de sistema
     */
    const healthCheckDetailed = async (request, response) => {
        try {
            // Verifica se vem de IP interno
            const clientIP = request.ip || request.connection.remoteAddress;
            const isInternal = clientIP.startsWith('10.') || 
                               clientIP.startsWith('172.') || 
                               clientIP.startsWith('192.168.') ||
                               clientIP === '::1' ||
                               clientIP === '127.0.0.1';
            
            if (!isInternal && process.env.NODE_ENV === 'production') {
                return response.status(403).json({ 
                    error: 'Forbidden - Internal use only' 
                });
            }

            const health = {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                version: process.env.APP_VERSION || 'unknown',
                buildDate: process.env.BUILD_DATE || 'unknown',
                environment: process.env.NODE_ENV || 'development',
                // ⚠️ Informações sensíveis
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch,
            };

            response.status(200).json(health);

        } catch (error) {
            response.status(503).json({
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    };

    // Endpoint público (com version e buildDate)
    app.get('/health', healthCheckPublic);

    // Endpoint detalhado (com nodeVersion e system info)
    app.get('/health/detailed', healthCheckDetailed);

}