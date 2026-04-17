import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { VaFormGuideDefinition } from "@/data/va-form-guides";
import { SITE_NAME } from "@/lib/site";

const PAGE_W = 612;
const PAGE_H = 792;
const M = 48;
const YELLOW = rgb(1, 0.94, 0.65);
const YELLOW_BORDER = rgb(0.85, 0.72, 0.2);
const TEXT = rgb(0.12, 0.1, 0.09);
const MUTED = rgb(0.35, 0.32, 0.28);
const FOOTER = rgb(0.45, 0.42, 0.38);
const WHITE_BOX = rgb(0.99, 0.99, 0.99);

function wrapLine(text: string, font: import("pdf-lib").PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const trial = current ? `${current} ${w}` : w;
    if (font.widthOfTextAtSize(trial, size) <= maxWidth) {
      current = trial;
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

export async function buildVaFormGuidePdf(def: VaFormGuideDefinition, veteranName: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage([PAGE_W, PAGE_H]);
  const maxTextW = PAGE_W - 2 * M;

  /** Distance from top of page downward */
  let cursorTop = 52;

  const needSpace = (h: number) => {
    if (cursorTop + h > PAGE_H - M) {
      page = pdf.addPage([PAGE_W, PAGE_H]);
      cursorTop = 52;
    }
  };

  const drawTextLine = (text: string, size: number, bold = false, color = TEXT) => {
    const f = bold ? fontBold : font;
    const lines = wrapLine(text, f, size, maxTextW);
    for (const ln of lines) {
      needSpace(size + 6);
      const y = PAGE_H - cursorTop - size;
      page.drawText(ln, { x: M, y, size, font: f, color });
      cursorTop += size + 5;
    }
  };

  drawTextLine(`${SITE_NAME} — educational worksheet (not a government form)`, 9, false, MUTED);
  cursorTop += 4;
  drawTextLine(`${def.formNumber}`, 13, true);
  drawTextLine(def.shortTitle, 11, false);
  cursorTop += 6;

  drawTextLine("Veteran name (from your account if you are signed in):", 10, true);
  const nameLines = wrapLine(veteranName.slice(0, 200), fontBold, 12, maxTextW - 16);
  const nameBoxH = Math.max(26, 12 + nameLines.length * 15);
  needSpace(nameBoxH + 6);
  page.drawRectangle({
    x: M,
    y: PAGE_H - cursorTop - nameBoxH,
    width: maxTextW,
    height: nameBoxH,
    borderColor: YELLOW_BORDER,
    borderWidth: 0.75,
    color: rgb(0.98, 0.98, 0.96),
  });
  let nameCursor = cursorTop + 12;
  for (const nl of nameLines) {
    page.drawText(nl, {
      x: M + 8,
      y: PAGE_H - nameCursor - 12,
      size: 12,
      font: fontBold,
      color: TEXT,
    });
    nameCursor += 15;
  }
  cursorTop += nameBoxH + 8;

  drawTextLine("Official form and instructions:", 10, true);
  drawTextLine(def.officialFindFormUrl, 9, false, rgb(0, 0.25, 0.55));
  cursorTop += 8;

  drawTextLine(def.whatThisIs, 9, false, MUTED);
  cursorTop += 10;

  drawTextLine("Left side = fill-in worksheet. Right side (yellow) = guidance for that section.", 10, true, TEXT);
  drawTextLine("Use this as practice and prep. File only on official VA forms/VA.gov.", 9, false, MUTED);
  cursorTop += 12;

  const COL_GAP = 14;
  const COL_W = (maxTextW - COL_GAP) / 2;

  for (const block of def.sections) {
    const fillTitleSize = 10;
    const guideTitleSize = 11;
    const textSize = 9;
    const boxPad = 10;
    const promptBottomGap = 8;
    const writingLineGap = 10;

    const fillTitleLines = wrapLine(`${block.heading} — fill this side`, fontBold, fillTitleSize, COL_W - 2 * boxPad);
    const guideTitleLines = wrapLine(block.heading, fontBold, guideTitleSize, COL_W - 2 * boxPad);
    const promptLines = block.youComplete.map((item) => {
      const lines = wrapLine(item, font, textSize, COL_W - 2 * boxPad);
      return lines.length > 2 ? [...lines.slice(0, 2), "…"] : lines;
    });

    const fillInnerH =
      fillTitleLines.length * (fillTitleSize + 4) +
      8 +
      promptLines.reduce((acc, lines) => acc + lines.length * (textSize + 2) + promptBottomGap + writingLineGap, 0) +
      8;

    const guideBullets = block.youComplete.map((item) => `• ${item}`);
    const guideBulletLines = guideBullets.flatMap((line) => wrapLine(line, font, textSize, COL_W - 2 * boxPad - 4));
    const guideInnerH =
      guideTitleLines.length * (guideTitleSize + 4) +
      8 +
      guideBulletLines.length * (textSize + 3) +
      12;

    const totalH = Math.max(fillInnerH, guideInnerH) + boxPad * 2;

    needSpace(totalH + 8);

    const boxTop = cursorTop;
    page.drawRectangle({
      x: M,
      y: PAGE_H - boxTop - totalH,
      width: COL_W,
      height: totalH,
      color: WHITE_BOX,
      borderColor: YELLOW_BORDER,
      borderWidth: 0.6,
    });

    page.drawRectangle({
      x: M + COL_W + COL_GAP,
      y: PAGE_H - boxTop - totalH,
      width: COL_W,
      height: totalH,
      color: YELLOW,
      borderColor: YELLOW_BORDER,
      borderWidth: 0.6,
    });

    let fillCursor = boxTop + boxPad;
    for (const tl of fillTitleLines) {
      page.drawText(tl, {
        x: M + boxPad,
        y: PAGE_H - fillCursor - fillTitleSize,
        size: fillTitleSize,
        font: fontBold,
        color: TEXT,
      });
      fillCursor += fillTitleSize + 4;
    }

    fillCursor += 4;
    for (const lines of promptLines) {
      for (const ln of lines) {
        page.drawText(ln, {
          x: M + boxPad,
          y: PAGE_H - fillCursor - textSize,
          size: textSize,
          font,
          color: TEXT,
        });
        fillCursor += textSize + 2;
      }
      fillCursor += 2;
      const lineY = PAGE_H - fillCursor;
      page.drawLine({
        start: { x: M + boxPad, y: lineY },
        end: { x: M + COL_W - boxPad, y: lineY },
        thickness: 0.9,
        color: rgb(0.2, 0.2, 0.2),
      });
      fillCursor += promptBottomGap + writingLineGap;
    }

    let guideCursor = boxTop + boxPad;
    for (const tl of guideTitleLines) {
      page.drawText(tl, {
        x: M + COL_W + COL_GAP + boxPad,
        y: PAGE_H - guideCursor - guideTitleSize,
        size: guideTitleSize,
        font: fontBold,
        color: TEXT,
      });
      guideCursor += guideTitleSize + 4;
    }

    guideCursor += 4;
    for (const bl of guideBulletLines) {
      page.drawText(bl, {
        x: M + COL_W + COL_GAP + boxPad + 4,
        y: PAGE_H - guideCursor - textSize,
        size: textSize,
        font,
        color: TEXT,
      });
      guideCursor += textSize + 3;
    }

    cursorTop = boxTop + totalH + 10;
  }

  needSpace(36);
  drawTextLine(
    "Educational use only — not legal advice. Use VA.gov and official VA forms to file. Confirm form numbers on VA’s site.",
    8,
    false,
    FOOTER,
  );

  return pdf.save();
}
