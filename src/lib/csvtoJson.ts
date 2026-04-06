// app/api/convert/route.ts
import fs from "fs";
import csv from "csvtojson";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const readStream = fs.createReadStream("large_data.csv");
    const writeStream = fs.createWriteStream("output.json");

    return await new Promise((resolve) => {
      readStream
        .pipe(
          csv({
            constructResult: false,
          }),
        )
        .pipe(writeStream)
        .on("finish", () => {
          console.log("Conversion finished.");
          resolve(NextResponse.json({ message: "Conversion completed" }));
        })
        .on("error", (err: Error) => {
          console.error(err);
          resolve(
            NextResponse.json({ error: "Conversion failed" }, { status: 500 }),
          );
        });
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
