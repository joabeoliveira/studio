// import-catmat.js
const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');
const iconv = require('iconv-lite'); // Importa a nova biblioteca
require('dotenv').config();

const BATCH_SIZE = 1000;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Erro: Variáveis de ambiente não encontradas.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importCatmatData() {
  let batch = [];
  let totalRows = 0;

  console.log('Iniciando a leitura do arquivo catmat.csv com conversão de encoding...');

  fs.createReadStream('catmat.csv')
    // ***** LINHA MODIFICADA AQUI *****
    // Converte o stream do arquivo de 'latin1' para 'utf-8' em tempo real
    .pipe(iconv.decodeStream('latin1')) 
    // **********************************
    .pipe(csv({ 
      separator: ';',
      mapHeaders: ({ header }) => header.trim()
    }))
    .on('data', (data) => {
      const row = {
        codigo_catmat: parseInt(data.codigo_catmat, 10),
        descricao: data.descricao
      };

      if (!isNaN(row.codigo_catmat) && row.descricao) {
         batch.push(row);
      }

      if (batch.length === BATCH_SIZE) {
        // Envia o lote para o Supabase
        supabase.from('catalogo_materiais').insert(batch).then(({ error }) => {
          if (error) console.error('Erro no lote:', error.message);
        });
        totalRows += batch.length;
        console.log(`Enviando lote de ${batch.length} linhas... Total processado: ${totalRows}`);
        batch = []; // Limpa o lote
      }
    })
    .on('end', async () => {
      if (batch.length > 0) {
        // Envia o último lote
        const { error } = await supabase.from('catalogo_materiais').insert(batch);
        if (error) console.error('Erro no lote final:', error.message);
        totalRows += batch.length;
      }
      console.log(`\n🎉 Processo de leitura finalizado. A importação continua em segundo plano.`);
      console.log(`Total de ${totalRows} registros foram enviados para importação.`);
    });
}

importCatmatData();