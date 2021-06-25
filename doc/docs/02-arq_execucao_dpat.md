# Introdução

Conforme detalhado na seção [Arquitetura de Software](/02-arq_geral), para execução da Plataforma de Conhecimento do Cerrado são necessárias 3 estruturas criadas e funcionais na máquina do usuário:

1. O Banco de Dados `lapig` restaurado no serviço do PostgreSQL devidamente instalado com a extensão PostGis.

2. O serviço *OWS Server* devidamente configurado e executando em um IP e porta.

3. O *Application Server* e client (Front-end) da aplicação compilados e executando.


## Restaurando e disponibilizando o banco de dados lapig

Para restaurar o banco `lapig` no PostgreSQL, é necessário ter o serviço PostgreSQL executando na máquina do usuário. Para tal, pode-se utilizar o tutorial neste [link](https://medium.com/@thiago.reis/instalando-e-configurando-postgresql-no-ubuntu-86716cda5894) para instalar e executar o PostgreSQL e o PGAdmin3.

Ao final do tutorial, deve-se verificar qual a versão do PostgreSQL instalado (ver: [link](https://phoenixnap.com/kb/check-postgresql-version)) e também instalar a extensão do Postgis para a versão adequada de acordo com o tutorial deste [link](https://computingforgeeks.com/how-to-install-postgis-on-ubuntu-debian/) no **Step 4: Install PostGIS on Ubuntu 20.04/18.04 / Debian 10**.

Com o PostgreSQL e o PostGIS instalados, em seguida é necessário realizar o download do último backup disponibilizado no [endereço](https://drive.google.com/file/d/19nVhry3bvHpV_oY861saBV9prXpfnFtd/view?usp=sharing) e extraí-lo.

``` sh
$ tar -xfv BKP_BANCO_DADOS_LAPIG.tar.gz
```

Em seguida, deve-se exportar a variável de senha do banco de dados configurada anteriormente.

``` sh
$ export PGPASSWORD= <db_password>
```

Após exportação da senha, deve criar o banco de dados no serviço PostgreSQL. Este passo pode ser realizado por linha de comando ou com ajuda do PGAdmin3. Ambos os passos estão demonstrados abaixo.

``` sh
$ psql -h <host_address> -U <db_user> -c "create database lapig;"
```

Após a criação do banco de dados, deve-se criar as extensões do PostGis e PlPGSql para uso das funções na aplicação.

``` sh
$ psql -h <host_address> -U <db_user> -d lapig -c "create extension postgis;"

$ psql -h <host_address> -U <db_user> -d lapig -c "create extension plpgsql;"
```

Agora de fato pode-se restaurar o banco de dados baixado e extraído para a database `lapig` criada, o que pode ser alcançada através do comando.

``` sh
$ pg_restore -U lapig -h <host_address> -v -j 24 --format=d -C -d lapig lapig.sql/
```

## Deployment da aplicação Plataforma de Conhecimento do Cerrado

Para execução da Plataforma de Conhecimento do Cerrado é importante ressaltar que o Banco de Dados deve estar restaurado e acessível conforme abordado na [seção](/02-arq_execucao_dpat/#restaurando-e-disponibilizando-o-banco-de-dados-fip-cerrado) e também deve-se ter o [OWS Server](/02-arq_execucao_dpat/#execucao-do-ows-server) funcionando corretamente.

Conforme mencionado anteriormente, a estrutura do OWS Server foi construída com o apoio do [Docker](https://www.docker.com/), portanto para instalação do mesmo, deve-se seguir os passos definidos nos tutoriais de acordo com o sistema operacional, seja ele [Debian](https://docs.docker.com/engine/install/debian/) ou [CentOS](https://docs.docker.com/engine/install/centos/). Além do Docker, o script também faz uso das seguintes dependências:

| Dependência | Tutorial para Instalação |
| :------: | ---- |
| Perl | [https://learn.perl.org/installing/unix_linux.html](https://learn.perl.org/installing/unix_linux.html) |
| wget | [https://www.cyberciti.biz/faq/how-to-install-wget-togetrid-of-error-bash-wget-command-not-found/](https://www.cyberciti.biz/faq/how-to-install-wget-togetrid-of-error-bash-wget-command-not-found/) |
| curl | [https://www.cyberciti.biz/faq/how-to-install-curl-command-on-a-ubuntu-linux/](https://www.cyberciti.biz/faq/how-to-install-curl-command-on-a-ubuntu-linux/) |
| Git | [https://gist.github.com/derhuerst/1b15ff4652a867391f03](https://gist.github.com/derhuerst/1b15ff4652a867391f03) |
| Docker | [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/) |
| Docker Compose | [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/) |

A seguir será abordado duas maneiras de executar a aplicaçãa Plataforma de Conhecimento do Cerrado em ambientes de Desenvolvimento e Produção. Para o ambiente de desenvolvimento será detalhado um passo a passo partindo do pressuposto que um programador irá dar manutenção ou continuidade na Plataforma de Conhecimento do Cerrado. Já o ambiente de produção, será disponibilizado um script que executa todos os passos para disponibilizar a Plataforma de Conhecimento do Cerrado em uma porta da máquina que está sendo executado. 

Em seguida, certifique-se de criar corretamente um arquivo `.env` conforme abordado na [seção](02-arq_servidor_de_aplicacao.md/#servidor-de-aplicacao). Um exemplo de arquivo `.env` criado durante o processo de execução do script para o ambiente de Produção pode ser observado abaixo:

```
APP_PRODUCAO='/data/dados-lapig/dpat-files'
APP_PRODUCAO_CEPF='/data/dados-lapig/cepf-files'
CLIENT_DIR='/../client/dist/lapig-cepf-cerrado/'
LANG_DIR='/lang'
LOG_DIR='/log/'
TMP='/tmp/'
FIELD_DATA_DIR='/media/campo/'
UPLOAD_DATA_DIR='/uploads/'
DOWNLOAD_DIR='/data/dados-lapig/download_atlas/'
DOWNLOAD_DATA_DIR='/downloads-cepf/'

PG_USER='db_user'
PG_HOST='127.0.0.1'
PG_DATABASE='lapig'
PG_PASSWORD='db_password'
PG_PORT='db_port'
PG_DEBUG=true

PORT=3000
OWS_HOST='http://172.18.0.8:5000'
OWS_DOMAINS='http://172.18.0.8:5000'
```

### Ambiente de Desenvolvimento

Assim como abordado na [seção](/02-arq_geral/#arquitetura-de-software), a Plataforma de Conhecimento do Cerrado foi construído com NodeJS como *Application Server* e Angular como cliente (*WebMap Client*). Portanto, primeiramente é necessária a instalação destes componentes na máquina do desenvolvedor. Para tal, pode-se seguir o passo-a-passo elaborado neste [link](https://www.tecmint.com/install-angular-cli-on-linux/)

Para execução da Plataforma de Conhecimento do Cerrado em ambiente de desenvolvimento, primeiramente é necessário realizar um [`fork`](https://github.com/UNIVALI-LITE/Portugol-Studio/wiki/Fazendo-um-Fork-do-reposit%C3%B3rio) do projeto para a sua conta pessoal do Github e em seguida executar um [`git clone`](https://docs.github.com/pt/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository) do [repositório do projeto](https://github.com/lapig-ufg/cepf-cerrado-platform).

Para inicializar o servidor de aplicação (*Application Server*) deve-se executar o passo-a-passo descrito na [seção](/02-arq_servidor_de_aplicacao/#servidor-de-aplicacao). A execução da mesma irá inicializar o *Application Server* em localhost na porta 3000.

Em seguida, para inicializar o *WebMap Client* localizado na pasta [`src/client`](https://github.com/lapig-ufg/d-pat/tree/master/src/client), basta navegar até a pasta **client** e instalar as dependências listadas no **package.json** através do comando:

```
$ npm install
```

Após a devida instalação das dependências, pode-se então compilar e inicializar a aplicação. Mais uma vez, a fim de facilitar, foi criado um script [`start.sh`](https://github.com/lapig-ufg/cepf-cerrado-platform/blob/master/src/client/start.sh) para inicializar o *WebMap Client*, portanto basta executar:

```
$ ./src/client/start.sh
```

Ao finalizar a compilação do projeto, a aplicação estará executando em localhost na porta padrão do Angular, que é a porta 4200. Portanto, para acessar a página Web criada pela aplicação, acesse pelo navegador:

```
http://localhost:4200
```

### Ambiente de Produção

Em seguida, uma segunda maneira de disponibilizar a Plataforma de Conhecimento do Cerrado é em ambiente de produção. É importante ressaltar que o *OWS Server* deve estar executando para que a Plataforma de Conhecimento do Cerrado faça as requisições de imagens das diferentes camadas utilizadas pelo sistema.

Para facilitar o processo de *deployment* em produção, foi criado um [script](https://drive.google.com/file/d/1vH3BGK_KmU_n1nTDv5qCKh6rvNx4bSS7/view?usp=sharing) que realiza todos os passos necessários para execução da Plataforma de Conhecimento do Cerrado em produção. Para executar o script basta executar em um Terminal:

``` sh
$ ./start-cepf+ows.sh
```

Assim como detalhado na seção de [Deployment do OWS Server](/02-arq_execucao_dpat/#execucao-do-ows-server), este script irá pedir ao usuário que informe os parâmetros **endereço, nome, porta, usuário e senha** do Banco de Dados, de forma a alterar corretamente o arquivo de configuração do ambiente, `.env` corretamente.

Em seguida, após pedir as informações do Banco de Dados, o script irá pedir ao usuário que informe o local onde a estrutura de pastas da Plataforma de Conhecimento do Cerrado deverá ser criada e também qual o endereço de IP da máquina de produção onde será realizado o *deployment* assim como informado nas imagens abaixo.

![Senha do BD](imgs/02/ows-standalone/dpat-1.png)

![Senha do BD](imgs/02/ows-standalone/dpat-2.png)

Basicamente o script deverá criar e ajustar automaticamente as variáveis de ambiente da Plataforma de Conhecimento do Cerrado, realizar o download e importação do [contâiner docker](https://drive.google.com/file/d/1QKiBeo9II2auQik1jJdBACnHp4qrfc0f/view?usp=sharing) onde todas as dependências do projeto já estão devidamente ajustadas e executar os passos necessários para compilar e disponibilizar a aplicação no endereço de IP informado na execução do script na **porta 3000**, assim como apresentado na imagem abaixo.

Após execução dos scripts o OWS Server estará executando na máquina do usuário na porta **5000** e a Plataforma de Conhecimento do Cerrado também na máquina do usuário na porta **3000**.
