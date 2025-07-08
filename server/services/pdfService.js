const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generateProposalPDF(data, layout = 'comercial', preco = '', validade = '', termos = '', logoPath = '') {
  return new Promise((resolve, reject) => {
    const slugify = str => str.toLowerCase().replace(/\s+/g, '_').replace(/[^\w\-]+/g, '');
    const fileName = `proposta_${slugify(data.cliente || 'cliente')}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '..', 'outputs', fileName);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const styleMap = {
      comercial: {
        font: 'Helvetica',
        primary: '#2E86DE',
        accent: '#10B981',
        bg: '#F8F9FA'
      },
      criativo: {
        font: 'Courier-Bold',
        primary: '#E91E63',
        accent: '#FF9800',
        bg: '#FFF0F6'
      },
      minimalista: {
        font: 'Helvetica-Oblique',
        primary: '#111827',
        accent: '#6B7280',
        bg: '#FFFFFF'
      }
    };
    const styles = styleMap[layout] || styleMap['comercial'];

    const safeText = txt => txt?.toString().replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim() || '';

    // CAPA
    doc.font(styles.font);
    doc.save();
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(styles.bg);
    doc.restore();

    const centerX = doc.page.width / 2;
    const logoWidth = 120;
    const logoY = 60;

    if (logoPath) {
      try {
        const resolvedLogoPath = path.resolve(logoPath);
        if (fs.existsSync(resolvedLogoPath)) {
          const imageBuffer = fs.readFileSync(resolvedLogoPath);

          const logoWidth = 120;
          const centerX = doc.page.width / 2;
          const logoY = 60;

          console.log("Logo path:", resolvedLogoPath);
          console.log("Page width:", doc.page?.width);
          console.log("Logo inserting at:", centerX - logoWidth / 2, logoY);
          
          doc.image(imageBuffer, centerX - logoWidth / 2, logoY, {
            width: logoWidth,
            fit: [logoWidth, 60],
          });
        }
      } catch (err) {
        console.warn("Logo não carregada:", err.message);
      }
    }

    doc.fontSize(28)
      .fillColor(styles.primary)
      .font('Helvetica-Bold')
      .text('PROPOSTA COMERCIAL', 0, 160, { align: 'center' });

   if (data.cliente) {
      doc.fontSize(14).fillColor(styles.accent)
        .text(`Prezado(a) ${safeText(data.cliente)}`, { align: 'center' });
    }

    doc.moveDown(1);
    doc.fontSize(12).fillColor('#444').text(`Data da Proposta: ${data.data_proposta || new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
    doc.text(`Número da Proposta: ${data.numero_proposta || data.numeroProposta || Date.now()}`, { align: 'center' });

    // Nova Página
    doc.addPage();
    doc.font(styles.font).fillColor('black');

    // Seções organizadas
    doc.fontSize(16).fillColor(styles.primary).text('1. Detalhes do Pedido', { underline: true }).moveDown(0.5);
    if (data.produto) doc.fontSize(12).fillColor('black').text(`Produto: ${safeText(data.produto)}`);
    if (data.quantidade) doc.text(`Quantidade Solicitada: ${safeText(data.quantidade)}`);
    if (data.quantidadeMinima) doc.text(`Quantidade Mínima: ${safeText(data.quantidadeMinima)}`);
    if (data?.resumo_comercial?.preco_unitario || data.precoUnitario)
      doc.text(`Preço Unitário: R$ ${safeText(data?.resumo_comercial?.preco_unitario || data.precoUnitario)}`);
    const valorFinal = data?.resumo_comercial?.valor_final || preco || data.precoTotal;
    if (valorFinal) doc.fillColor(styles.accent).text(`Preço Total: R$ ${safeText(valorFinal)}`).moveDown();

    doc.fontSize(16).fillColor(styles.primary).text('2. Condições Comerciais', { underline: true }).moveDown(0.5);
    if (data?.resumo_comercial?.forma_pagamento || data.pagamento)
      doc.fontSize(12).fillColor('black').text(`Pagamento: ${safeText(data?.resumo_comercial?.forma_pagamento || data.pagamento)}`);
    if (data?.resumo_comercial?.parcelamento || data.parcelamento)
      doc.text(`Parcelamento: ${safeText(data?.resumo_comercial?.parcelamento || data.parcelamento)}`);
    if (data?.resumo_comercial?.prazo_entrega || data.prazoEntrega)
      doc.text(`Prazo de Entrega: ${safeText(data?.resumo_comercial?.prazo_entrega || data.prazoEntrega)}`);
    if (data.garantia) doc.text(`Garantia: ${safeText(data.garantia)}`);
    if (data?.resumo_comercial?.validade_proposta || validade || data.validade)
      doc.text(`Validade da Proposta: ${safeText(data?.resumo_comercial?.validade_proposta || validade || data.validade)}`).moveDown();

    doc.fontSize(16).fillColor(styles.primary).text('3. Benefícios e Diferenciais', { underline: true }).moveDown(0.5);
    if (data.beneficios_exclusivos || data.beneficios) {
      doc.fontSize(12).fillColor('black').text(`🎁 ${safeText(data.beneficios_exclusivos || data.beneficios)}`).moveDown(0.5);
    }
    if (data.termos_condicoes || termos) doc.text(`Termos e Condições: ${safeText(data.termos_condicoes || termos)}`).moveDown();

    doc.fontSize(16).fillColor(styles.primary).text('4. Observações Finais', { underline: true }).moveDown(0.5);
    if (data.observacoes_finais) doc.fontSize(11).fillColor('black').text(safeText(data.observacoes_finais)).moveDown(1);

    doc.fontSize(10).fillColor('#666').text('Este documento é válido apenas para fins comerciais. Consulte nossos termos completos no site oficial da empresa.').moveDown(2);

    doc.end();
    stream.on('finish', () => resolve({ filePath, fileName }));
    stream.on('error', reject);
  });
}

module.exports = { generateProposalPDF };
