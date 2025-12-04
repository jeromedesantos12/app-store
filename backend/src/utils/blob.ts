import { put, del } from "@vercel/blob";
import axios from "axios";
import { config } from "dotenv";

config();

const url = process.env.BLOB_URL as string;

export async function downloadFile(dir: string, name: string) {
  return await axios.get(`${url}/${dir}/${name}`, {
    responseType: "arraybuffer",
  });
}

export async function uploadFile(dir: string, name: string, buffer: Buffer) {
  return await put(`${dir}/${name}`, buffer, {
    access: "public",
  });
}

export async function deleteFile(dir: string, name: string) {
  return await del(`${url}/${dir}/${name}`);
}
