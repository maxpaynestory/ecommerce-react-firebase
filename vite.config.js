import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import admin from "firebase-admin";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import { appendFileSync, unlink } from "fs";

async function mySiteGenerationScript() {
  const app = initializeApp({
    credential: admin.credential.cert(process.env.SABIYYA_FIRESTORE_ADMIN),
  });
  const firestore = getFirestore(app);
  const query = await firestore
    .collection("products")
    .where("maxQuantity", ">", 0)
    .get();
  const products = query.docs;
  const stream = new SitemapStream({
    hostname: "https://sabiyya-collections.web.app",
  });
  const links = [{ url: "/shop", changefreq: "weekly", priority: 0.5 }];
  products.forEach((doc) => {
    links.push({
      url: `/product/${doc.id}`,
      changefreq: "daily",
      priority: 1.0,
    });
  });
  const data = await streamToPromise(Readable.from(links).pipe(stream));
  const csvFileName = "./dist/sitemap.xml";
  unlink(csvFileName, () => {});
  appendFileSync(csvFileName, data.toString());
  console.log("Sitemap Generated");
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "postbuild-commands",
      closeBundle: async () => {
        await mySiteGenerationScript();
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
});
