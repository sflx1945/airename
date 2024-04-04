import { Base64 } from "https://deno.land/x/bb64@1.1.0/mod.ts";
import { existsSync } from "https://deno.land/std@0.212.0/fs/exists.ts";

const ollama_baseurl = Deno.args[0] || 'http://localhost:11434';
const ollama_model = Deno.args[1] || 'llava:13b';

console.log("Using Ollama API: " + ollama_baseurl + "/api/generate");

export async function getkeywords(image: string): Promise<string[]> {
  const body = {
    "model": "llava:13b",
    "model": ollama_model,
    "format": "json",
    "prompt": `Describe the image as a collection of keywords. Output in JSON format. Use the following schema: { filename: string, keywords: string[] }`,
    "images": [image],
    "stream": false
  };

  const response = await fetch("http://localhost:11434/api/generate", {
  const response = await fetch( `${ollama_baseurl}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
@@ -31,14 +37,20 @@ function createFileName(keywords: string[], fileext: string): string {

if (import.meta.main) {
  const currentpath = Deno.cwd();
  const newDir = "./ai-renamed";

  if (!existsSync(newDir)) {
    await Deno.mkdir(newDir);
  }

  for (const file of Deno.readDirSync(".")) {
    if (file.name.endsWith(".jpg") || file.name.endsWith(".png")) {
    if (file.name.endsWith(".jpg") || file.name.endsWith(".jpeg") || file.name.endsWith(".png")) {
      const b64 = Base64.fromFile(`${currentpath}/${file.name}`).toString();
      const keywords = await getkeywords(b64);
      const newfilename = createFileName(keywords, file.name.split(".").pop()!);
      Deno.copyFileSync(`${currentpath}/${file.name}`, `${currentpath}/${newfilename}`);
      Deno.copyFileSync(`${currentpath}/${file.name}`, `${newDir}/${newfilename}`);

      console.log(`Copied ${file.name} to ${newfilename}`);
      console.log(`Copied ${file.name} to ${newDir}/${newfilename}`);
    }
  }
}
 2 changes: 1 addition & 1 deletion2  
package.json
Viewed
@@ -1,3 +1,3 @@
{
  "version": "0.0.4"
  "version": "0.0.6"
}
  18 changes: 18 additions & 0 deletions18  
readme.md
Viewed
@@ -18,3 +18,21 @@ A simple executable that renames image files based on keywords that describe the
Navigate to a folder with some images in it and run `airenamer`.

Make sure you have a backup first. It only copies the files, but I'm not responsible for any data loss.
This is useful when you have Ollama running on remote host and you want to use different model.

### Arguments

You can override the default Ollama API endpoint address and model by passing in arguments when calling the tool.

| Argument   | Description                                              | Default value                       |
| ---------- | -------------------------------------------------------- | -----------------------------      |
| `base_url` | The base URL for the Ollama API endpoint.                | `http://localhost:11434`           |
| `model`    | The Ollama model to use for generating image descriptions.| `llava:13b`                        |

To override default values when calling the tool, you can use the following example:

```
airenamer http://192.168.1.100:11434 bakllava:7b
```


