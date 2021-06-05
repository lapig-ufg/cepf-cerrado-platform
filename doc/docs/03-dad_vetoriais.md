# Banco de dados

Na plataforma de conhecimento do cerrado todos os dados estão armazenados em um banco de dados PostgreSQL. O último backup deste banco pode ser encontrado no [COLOCAR LINK AQUI]() no arquivo `BKP_BANCO_DADOS_CEPF.tar.gz`. 

## Processo de atualização

Diversos dados presentes na plataforma de conhecimento do cerrado são periodicamente atualizados pelas instituições competentes. Desta forma, a medida que os mesmos são atualizados e disponibilizados pelas instituições também é necessário realizar a atualização no banco de dados da plataforma de conhecimento do cerrado.

Os comandos a seguir foram todos desenvolvidos na linguagem `sql`, portanto podem ser executados em qualquer ambiente que realize a conexão com PostgreSQL, tais como o [pgAdmin](https://www.pgadmin.org/) ou o próprio ambiente nativo conhecido como `psql`. A fim de facilitar, pode-se criar um arquivo de extensão `.sql` e executá-lo da seguinte forma:

```
psql "dbname='<db_name>' user='<db_user>' password='<db_pwd>' host='<db_host'" -f <path_to_>/yourFileName.sql
```

### Inserindo um Shapefile novo:

``` sh
shp2pgsql -s 4674 -W "UTF-8" nome_arquivo.shp public.exemplo_tabela | psql -h <host_address> -U <db_user> -d <db_name>
```

O comando acima importa os dados do Shapefile `nome_arquivo.shp` em uma tabela nomeada `exemplo_tabela`.

### Script utilizado para inserir dados raster:

 O Script para inserção de dados rasters pode ser acessado por meio do [link](https://github.com/lapig-ufg/cepf-cerrado-platform/tree/master/devops).<br>
Para inserção de um dado raster é necessaŕio um shp com a região desejada a inserir, para que os recortes sejam realizados. Todos os dados do banco foram inseridos com base em um regions.shp que possui todos os recortes dos estados e municípios do Cerrado. Dessa forma o dado é inserido no banco de dados já com os recortes por regiões. O script deve ser ajustado conforme a necessidade, ele é apenas um exemplo para se basear.