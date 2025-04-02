FROM lapig/app_cepf:base


LABEL maintainer="Rocha Jairo <devjairomr.gmail.com.br>"


ADD . /APP/cepf-cerrado-platform
COPY ./version.jso* /APP/cepf-cerrado-platform/src/client/dist/lapig-cepf-cerrado/assets/

CMD [ "/bin/bash", "-c", "cd /APP/cepf-cerrado-platform/src/server/;  ./prod-start.sh; tail -f /APP/cepf-cerrado-platform/src/server/app.out"]

#ENTRYPOINT [ "/APP/Monitora.sh"]