import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { fileURL } from "../../config/axios";
import download from "downloadjs";

export default async function createPdf(imgUrl, data) {
  const signatureUrl = imgUrl;

  const signImageBytes = await fetch(signatureUrl).then((res) =>
    res.arrayBuffer()
  );

  const url = `${fileURL}uks.pdf`;
  const existingPdfBytes = await fetch(url, {
    headers: {
      "Access-Control-Allow-Credentials" : "true" ,
      "Access-Control-Allow-Origin" : "https://saturaise.com/" ,
      "Access-Control-Allow-Methods" : "GET,OPTIONS,PATCH,DELETE,POST,PUT",
      "Access-Control-Allow-Headers" : "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    }
  }
  ).then((res) => {
    return res
  });

  const bytes = await existingPdfBytes.arrayBuffer();

  const pdfDoc = await PDFDocument.load(bytes);

  const signImage = await pdfDoc.embedPng(signImageBytes);
  pdfDoc.registerFontkit(fontkit);
  const urlFont = `${fileURL}lato.ttf`;

  const ubuntuBytes = await fetch(urlFont, {
    headers: {
      "Access-Control-Allow-Credentials" : "true" ,
      "Access-Control-Allow-Origin" : "https://saturaise.com/" ,
      "Access-Control-Allow-Methods" : "GET,OPTIONS,PATCH,DELETE,POST,PUT",
      "Access-Control-Allow-Headers" : "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    }
  }).then((res) => res.arrayBuffer());

  const font = await pdfDoc.embedFont(ubuntuBytes);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  firstPage.drawImage(signImage, {
    x: 400,
    y: 15,
    width: 120,
    height: 70,
  });

  //nazwa
  firstPage.drawText(data.shoeName, {
    x: 106,
    y: 506,
    size: 12,
  });

  //rozmiar
  firstPage.drawText(data.size, {
    x: 114,
    y: 474,
    size: 12,
  });

  //cena za sztuke
  firstPage.drawText(`${data.price} PLN`, {
    x: 151,
    y: 442,
    size: 12,
  });

  //cena laczna
  firstPage.drawText(`${data.totalPrice} PLN`, {
    x: 138,
    y: 410,
    size: 12,
  });

  //imie i nazwisko
  firstPage.drawText(data.name, {
    x: 148,
    y: 650,
    size: 12,
    font: font,
  });

  //Adres zamieszkania
  firstPage.drawText(data.address, {
    x: 173,
    y: 618,
    size: 12,
    font: font,
  });

  //Email
  firstPage.drawText(data.email, {
    x: 146,
    y: 586,
    size: 12,
  });

  //Telefon
  firstPage.drawText(data.phone, {
    x: 146,
    y: 570,
    size: 12,
  });

  //Data
  firstPage.drawText(data.signDate, {
    x: 434,
    y: firstPage.getHeight() - 40,
    size: 12,
  });

  //Platnosc
  firstPage.drawText(data.paymentMethod, {
    x: 203,
    y: 240,
    size: 12,
  });

  // firstPage.setFont(timesRomanFont);

  const pdfBytes = await pdfDoc.save();
  const base64 = await pdfDoc.saveAsBase64();

  return base64;
}
