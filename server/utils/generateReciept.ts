import PDFDocument from "pdfkit";

export const generateReceiptPDF = (
  order: any,
  items: any[],
  res: any
) => {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=receipt-${order.order_code}.pdf`
  );

  doc.pipe(res);

  const pageWidth = doc.page.width;
  const margin = doc.page.margins.left;

  /* ========= HEADER ========= */

  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .text("Order Receipt", margin, 40, {
      align: "center",
    });

  doc
    .moveTo(margin, 80)
    .lineTo(pageWidth - margin, 80)
    .strokeColor("#E5E7EB")
    .stroke();

  /* ========= ORDER META ========= */

  doc.moveDown(2);

  doc.font("Helvetica").fontSize(11).fillColor("#374151");

  const metaTop = doc.y;

  doc.text(`Order Code:`, margin, metaTop);
  doc.font("Helvetica-Bold").text(order.order_code, 150, metaTop);

  doc.font("Helvetica").text(`Date:`, margin, metaTop + 15);
  doc.font("Helvetica-Bold").text(
    new Date(order.created_at).toLocaleDateString(),
    150,
    metaTop + 15
  );

  doc.font("Helvetica").text(`Email:`, margin, metaTop + 30);
  doc.font("Helvetica-Bold").text(order.email, 150, metaTop + 30);

  /* ========= ITEMS TABLE ========= */

  doc.moveDown(3);

  const tableTop = doc.y;

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#111827");

  doc.text("Item", margin, tableTop);
  doc.text("Qty", 320, tableTop, { width: 50, align: "right" });
  doc.text("Price", 400, tableTop, { width: 70, align: "right" });

  doc
    .moveTo(margin, tableTop + 15)
    .lineTo(pageWidth - margin, tableTop + 15)
    .strokeColor("#D1D5DB")
    .stroke();

  doc.font("Helvetica").fontSize(11).fillColor("#374151");

  let y = tableTop + 25;

  items.forEach((item) => {
    doc.text(item.product_name, margin, y, { width: 280 });

    doc.text(String(item.quantity), 320, y, {
      width: 50,
      align: "right",
    });

    doc.text(`$${Number(item.subtotal).toFixed(2)}`, 400, y, {
      width: 70,
      align: "right",
    });

    y += 20;
  });

  /* ========= TOTAL ========= */

  doc
    .moveTo(margin, y + 10)
    .lineTo(pageWidth - margin, y + 10)
    .strokeColor("#D1D5DB")
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("#111827")
    .text("Total", 320, y + 20, {
      width: 80,
      align: "right",
    });

  doc.text(`$${Number(order.total).toFixed(2)}`, 400, y + 20, {
    width: 70,
    align: "right",
  });

  /* ========= FOOTER ========= */

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#6B7280")
    .text(
      "Thank you for your purchase!",
      margin,
      doc.page.height - 60,
      { align: "center" }
    );

  doc.end();
};