import { useState } from 'react'
import { Code, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'

function ApiDocumentation() {
  const [copiedCode, setCopiedCode] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const exampleBaseUrl = 'https://uplinkr.example.com'

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const apiExamples = [
    {
      id: 'curl',
      language: 'cURL (Bash)',
      code: `# Set your public base URL (same as BASE_URL / CLIENT_URL in .env)
BASE_URL="${exampleBaseUrl}"

# Upload file
curl -X POST "$BASE_URL/api/upload" \\
  -F "file=@/path/to/your/file.pdf"

# Response:
# {
#   "success": true,
#   "file": {
#     "id": "abc123xyz",
#     "name": "file.pdf",
#     "size": 1048576,
#     "url": "$BASE_URL/f/abc123xyz",
#     "downloadUrl": "$BASE_URL/api/download/abc123xyz"
#   }
# }`
    },
    {
      id: 'javascript',
      language: 'JavaScript (Fetch API)',
      code: `// Upload file using Fetch API
const BASE_URL = '${exampleBaseUrl}'; // same as BASE_URL / CLIENT_URL in .env

const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const formData = new FormData();
formData.append('file', file);

fetch(BASE_URL + '/api/upload', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    console.log('File URL:', data.file.url);
  })
  .catch(error => console.error('Error:', error));`
    },
    {
      id: 'nodejs',
      language: 'Node.js (Axios)',
      code: `// Upload file using Axios
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = '${exampleBaseUrl}'; // same as BASE_URL / CLIENT_URL in .env

const form = new FormData();
form.append('file', fs.createReadStream('/path/to/file.pdf'));

axios.post(BASE_URL + '/api/upload', form, {
  headers: form.getHeaders()
})
  .then(response => {
    console.log('Success:', response.data);
    console.log('File URL:', response.data.file.url);
  })
  .catch(error => console.error('Error:', error));`
    },
    {
      id: 'python',
      language: 'Python (Requests)',
      code: `# Upload file using Python requests
import requests

BASE_URL = '${exampleBaseUrl}'  # same as BASE_URL / CLIENT_URL in .env

url = BASE_URL + '/api/upload'
files = {'file': open('/path/to/file.pdf', 'rb')}

response = requests.post(url, files=files)
data = response.json()

print('Success:', data)
print('File URL:', data['file']['url'])`
    },
    {
      id: 'php',
      language: 'PHP (cURL)',
      code: `<?php
// Upload file using PHP cURL
$file_path = '/path/to/file.pdf';
$BASE_URL = '${exampleBaseUrl}'; // same as BASE_URL / CLIENT_URL in .env
$url = $BASE_URL . '/api/upload';

$curl = curl_init();
$file = new CURLFile($file_path);

curl_setopt_array($curl, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => ['file' => $file]
]);

$response = curl_exec($curl);
$data = json_decode($response, true);

curl_close($curl);

echo "File URL: " . $data['file']['url'];
?>`
    },
    {
      id: 'go',
      language: 'Go',
      code: `// Upload file using Go
package main

import (
    "bytes"
    "fmt"
    "io"
    "mime/multipart"
    "net/http"
    "os"
)

const baseURL = "${exampleBaseUrl}" // same as BASE_URL / CLIENT_URL in .env

func uploadFile(filepath string) {
    file, _ := os.Open(filepath)
    defer file.Close()

    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)
    part, _ := writer.CreateFormFile("file", filepath)
    io.Copy(part, file)
    writer.Close()

    request, _ := http.NewRequest("POST", 
        baseURL+"/api/upload", body)
    request.Header.Set("Content-Type", writer.FormDataContentType())

    client := &http.Client{}
    response, _ := client.Do(request)
    defer response.Body.Close()

    fmt.Println("Upload completed")
}`
    },
    {
      id: 'csharp',
      language: 'C# (.NET)',
      code: `// Upload file using C# HttpClient
using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

class Program
{
    static async Task UploadFile(string filePath)
    {
        using var client = new HttpClient();
        using var form = new MultipartFormDataContent();
        using var fileStream = File.OpenRead(filePath);
        using var streamContent = new StreamContent(fileStream);
        
        form.Add(streamContent, "file", Path.GetFileName(filePath));
        
        const string BASE_URL = "${exampleBaseUrl}"; // same as BASE_URL / CLIENT_URL in .env
        var response = await client.PostAsync(
            BASE_URL + "/api/upload", form);
        var result = await response.Content.ReadAsStringAsync();
        
        Console.WriteLine(result);
    }
}`
    },
    {
      id: 'ruby',
      language: 'Ruby',
      code: `# Upload file using Ruby
require 'net/http'
require 'uri'

BASE_URL = '${exampleBaseUrl}' # same as BASE_URL / CLIENT_URL in .env

uri = URI(BASE_URL + '/api/upload')
request = Net::HTTP::Post.new(uri)

form_data = [
  ['file', File.open('/path/to/file.pdf')]
]

request.set_form(form_data, 'multipart/form-data')
response = Net::HTTP.start(uri.hostname, uri.port) do |http|
  http.request(request)
end

puts response.body`
    },
    {
      id: 'powershell',
      language: 'PowerShell',
      code: `# Upload file using PowerShell
$BASE_URL = "${exampleBaseUrl}" # same as BASE_URL / CLIENT_URL in .env
$uri = "$BASE_URL/api/upload"
$filePath = "C:\\path\\to\\file.pdf"

$form = @{
    file = Get-Item -Path $filePath
}

$response = Invoke-RestMethod -Uri $uri -Method Post -Form $form
Write-Host "File URL: $($response.file.url)"`
    }
  ]

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <Code className="w-6 h-6 text-primary-400" />
        <h3 className="text-2xl font-semibold">API Documentation</h3>
      </div>

      <div className="mb-6 bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-blue-300">API Endpoint</h4>
        <p className="text-slate-300 mb-2">
          <span className="font-mono bg-slate-900 px-2 py-1 rounded text-green-400">
            POST
          </span>{' '}
          <span className="font-mono">{`${exampleBaseUrl}/api/upload`}</span>
        </p>
        <p className="text-sm text-slate-400">
          Replace <code className="bg-slate-900 px-2 py-0.5 rounded">{exampleBaseUrl}</code> with your public URL
          (same as <code>BASE_URL</code> / <code>CLIENT_URL</code> in <code>.env</code>). Upload files using multipart/form-data with
          field name: <code className="bg-slate-900 px-2 py-0.5 rounded">file</code>
        </p>
      </div>

      <div className="space-y-2">
        {apiExamples.map((example) => (
          <div key={example.id} className="bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700">
            <button
              onClick={() => toggleExpand(example.id)}
              className="w-full flex items-center justify-between bg-slate-900/50 px-4 py-3 hover:bg-slate-900/70 transition-colors"
            >
              <span className="font-semibold text-sm text-slate-300">
                {example.language}
              </span>
              <div className="flex items-center space-x-2">
                {expandedId === example.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(example.code, example.id)
                    }}
                    className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {copiedCode === example.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
                {expandedId === example.id ? (
                  <ChevronUp className="w-5 h-5 text-primary-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </button>
            {expandedId === example.id && (
              <div className="p-4 overflow-x-auto border-t border-slate-700">
                <pre className="text-sm">
                  <code className="text-slate-300">{example.code}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-yellow-300">Response Format</h4>
        <pre className="text-sm overflow-x-auto">
          <code className="text-slate-300">{`{
  "success": true,
  "file": {
    "id": "abc123xyz",
    "name": "document.pdf",
    "size": 1048576,
    "url": "${exampleBaseUrl}/f/abc123xyz",
    "downloadUrl": "${exampleBaseUrl}/api/download/abc123xyz"
  }
}`}</code>
        </pre>
      </div>

      <div className="mt-6 bg-purple-600/20 border border-purple-500/30 rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-purple-300">Other API Endpoints</h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-mono bg-slate-900 px-2 py-1 rounded text-blue-400">GET</span>{' '}
            <span className="font-mono text-slate-300">/api/file/:fileId</span>
            <p className="text-slate-400 ml-12">Get file information</p>
          </div>
          <div>
            <span className="font-mono bg-slate-900 px-2 py-1 rounded text-green-400">GET</span>{' '}
            <span className="font-mono text-slate-300">/api/download/:fileId</span>
            <p className="text-slate-400 ml-12">Download file</p>
          </div>
          <div>
            <span className="font-mono bg-slate-900 px-2 py-1 rounded text-blue-400">GET</span>{' '}
            <span className="font-mono text-slate-300">/api/stats</span>
            <p className="text-slate-400 ml-12">Get system statistics</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiDocumentation
