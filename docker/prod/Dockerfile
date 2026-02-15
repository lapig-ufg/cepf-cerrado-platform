ARG IMAGE_NODE_ALPINE_VERSION=node:12-alpine3.15
FROM ${IMAGE_NODE_ALPINE_VERSION}

LABEL maintainer="Jairo Matos da Rocha <jairo@jairomr.com>"

RUN apk add --no-cache tini bash && \
    mkdir -p /app && \
    chown -R node:node /app

WORKDIR /app/server

COPY --chown=node:node ./src/server ./
COPY --chown=node:node ./src/client/dist ../client

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health',(r)=>{process.exit(r.statusCode===200?0:1)})"

ENTRYPOINT ["tini", "--"]
CMD ["node", "app.js"]