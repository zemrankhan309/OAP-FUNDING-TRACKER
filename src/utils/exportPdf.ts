import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export type PdfOptions = {
  orientation?: "portrait" | "landscape";
  unit?: string;
  format?: string | number[];
  margin?: number;
};

export async function exportHtmlStringToPdf(html: string, filename = "report.pdf", options?: PdfOptions) {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "100%";
  container.style.maxWidth = "1000px";
  container.style.background = "white";
  container.innerHTML = html;
  document.body.appendChild(container);

  const orient = options?.orientation === "landscape" ? "landscape" : "portrait";
  const unit = options?.unit || "pt";
  const format = options?.format || "a4";
  const margin = options?.margin ?? 20;

  const pdf = new jsPDF(orient as any, unit as any, format as any);
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const canvas = await html2canvas(container, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    width: container.scrollWidth,
    windowWidth: container.scrollWidth,
  });

  const imgData = canvas.toDataURL("image/png");
  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  document.body.removeChild(container);
  pdf.save(filename);
}

export default exportHtmlStringToPdf;
