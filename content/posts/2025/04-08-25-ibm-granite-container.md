---
title: "Containerized IBM Granite: Running Enterprise-Grade LLMs Locally with Ollama and vLLM (Hands On Guide)"
description: "A guide to running IBM Granite models in containers for local deployment."
slug: "ibm-granite-container"
date: 2025-04-08T09:00:00Z
draft: true
featuredImage: /assets/2025/04/04-08-25-granite-container.png
featuredImagePreview: /assets/2025/04/04-08-25-granite-container.png
featuredImageAlt: "Containerized IBM Granite"
images: ["/assets/2025/04/04-08-25-granite-container.png"]
seo:
  images: ["/assets/2025/04/04-08-25-granite-container.png"]
lightgallery: true
tags: [devsecops, kubernetes, etcd, k3s]
author: AB Engineering
---
<!--more-->

IBM Granite models have emerged as powerful contenders in the enterprise AI landscape, offering a balance of performance and resource efficiency that makes local deployment feasible even without data center resources. In this deep dive, we'll explore how to run these models in containers using Ollama and vLLM on Ubuntu, followed by practical approaches to fine-tuning and augmenting them for organization-specific use cases.

## Understanding IBM Granite Models

Granite is a family of large language models (LLMs) created by IBM specifically for enterprise applications. Unlike many commercial alternatives, Granite models are open source under the Apache 2.0 license, which means developers can experiment with, modify, and distribute them freely. This makes them particularly attractive for organizations that handle sensitive data and prefer to run their own LLMs rather than relying on external services.

What truly sets Granite apart is its transparency in training data. While most LLMs are notoriously vague about their training sources, Granite models provide visibility into their training data. The first 13 billion parameter Granite LLM was trained on approximately 6.5TB of data, including 1.8 million scientific papers from archive, all U.S. utility patents granted by the USPTO from 1975 through 2023, and legal opinions from U.S. federal and state courts. This enterprise-focused training makes Granite particularly well-suited for business applications.

The Granite family includes several specialized variants:

- **[Granite for Language]**: Models for accurate natural language processing with low latency
- **Granite for Code**: Trained on over 100 programming languages for enterprise software tasks
- **Granite for Time Series**: Fine-tuned for predictive analysis using historical data
- **Granite for GeoSpatial**: Developed with NASA to analyze satellite data for environmental monitoring
- **Granite Guardian**: Designed to detect risks in prompts and responses for safe AI use

You can learn more about each variant in the [Hugging Face documentation](https://huggingface.co/ibm-granite).

Each series comes in various parameter sizes, commonly ranging from 2B to 20B parameters, allowing organizations to select the appropriate trade-off between capability and resource requirements.

## The Small Model Advantage

In an AI landscape obsessed with parameter count, Granite models take a refreshingly practical approach. As the developer's version of "it's not the size that matters," these smaller models offer several compelling advantages:

1. **Performance Efficiency**: Despite their relatively modest size, Granite models can outperform competitors with twice their parameter count in specific tasks, particularly in coding and language processing.

2. **Resource Economy**: Running a 7B or 13B parameter model requires significantly less computational resources than running a 70B+ behemoth. This translates directly to lower infrastructure costs, faster response times, and the ability to deploy on consumer-grade hardware.

3. **Deployment Flexibility**: With smaller models, you can run multiple instances on the same hardware, allowing for greater system resilience and load balancing.

4. **Fine-tuning Feasibility**: The smaller parameter count makes these models substantially easier to fine-tune for specific domains without requiring specialized hardware or massive datasets.

Think of it as the difference between driving a nimble sports car versus a semi-truck when you're just delivering groceries. Sure, the truck can carry more, but for most practical purposes, the sports car gets the job done faster and with less fuel.

## Setting Up Ollama on Ubuntu with Docker

Ollama has emerged as one of the simplest ways to run LLMs locally. Let's walk through setting it up on Ubuntu using Docker.

First, ensure Docker is installed on your system:

```bash
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker
```

For GPU acceleration (highly recommended for reasonable performance), we need to install the NVIDIA Container Toolkit:

```bash
sudo apt update && sudo apt upgrade
sudo apt install curl

curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
&& curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
sed 's#deb https://#deb  https://#g' | \
sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sed -i -e '/experimental/ s/^#//g' /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
```

Configure the container runtime and restart Docker:

```bash
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

Now that we have Docker and GPU support configured, let's move on to setting up Ollama or vLLM.

Note that you only need to set up one of these options - Ollama or vLLM - based on your preference for ease of use or performance optimization.

## Option 1: Running Granite Models with Ollama

Now we can pull the Ollama Docker image and create a container:

```bash
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

This command creates a container named "ollama" from the official image, enables GPU support, and maps the necessary port and volume.

With Ollama set up, let's download and run a Granite model:

```bash
docker exec -it ollama ollama pull granite3.2:8b
```

This will download the 8B parameter model, which offers a good balance between capability and resource efficiency. Once downloaded, you can run it:

```bash
docker exec -it ollama ollama run granite3.2:8b
```

By default, Ollama runs models with a restricted context length to minimize memory usage. For more extensive prompts, you can increase the context window:

```bash
# When in the interactive session
/set parameter num_ctx 8192
```

Granite 3.1 models support up to 131072 (128k) context length, though be mindful of your RAM capacity when increasing this value.

For programmatic access, you can use curl to interact with Ollama's API:

```bash
curl -X POST "http://localhost:11434/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "granite3.2:8b",
    "messages": [
      {
        "role": "user",
        "content": "Explain quantum computing to a software engineer"
      }
    ]
  }'
```

## Option 2:Setting Up vLLM with Docker/Podman

While Ollama prioritizes ease of use, vLLM focuses on optimized performance through advanced serving techniques. Let's set it up using Docker:

```bash
docker pull vllm/vllm-openai:latest
```

If you prefer Podman (which some security-conscious users favor for its rootless operation by default), the command is similar:

```bash
podman pull vllm/vllm-openai:latest
```

To run vLLM with a Granite model, we'll mount our HuggingFace cache to avoid redundant downloads:

```bash
docker run --runtime nvidia --gpus all \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  -p 8000:8000 \
  --ipc=host \
  vllm/vllm-openai:latest \
  --model ibm-granite/granite-3.1-8b-instruct
```

For Podman users, you might need to disable SELinux labeling:

```bash
podman run --runtime nvidia --gpus all \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  -p 8000:8000 \
  --ipc=host \
  --security-opt label=disable \
  vllm/vllm-openai:latest \
  --model ibm-granite/granite-3.1-8b-instruct
```

The `--ipc=host` flag is crucial as it allows the container to access the host's shared memory, which vLLM requires for tensor parallel inference.

Once running, you can test the model with:

```bash
curl -H "Content-Type: application/json" http://localhost:8000/v1/chat/completions -d '{ 
  "model": "ibm-granite/granite-3.1-8b-instruct", 
  "messages": [ 
    {"role": "user", "content": "How are you today?"} 
  ]
}'
```

## Building Custom vLLM Images for Specific Hardware

For organizations with specialized hardware or performance requirements, building a custom vLLM image might be beneficial:

```bash
git clone https://github.com/vllm-project/vllm.git
cd vllm/

# For standard builds
DOCKER_BUILDKIT=1 docker build . --target vllm-openai --tag custom-vllm/vllm-openai --file docker/Dockerfile

# For specific architectures like ppc64le
podman build --security-opt label=disable --format docker -t vllm:ppc64le -f Dockerfile.ppc64le .
```

When building for your specific GPU architecture to optimize performance, add:

```bash
--build-arg torch_cuda_arch_list=""
```

This allows vLLM to detect and optimize for your specific GPU model.

## Fine-tuning Granite for Organization-Specific Knowledge with Unsloth

One of the key advantages of smaller models like Granite is the feasibility of fine-tuning them for specific domains with reasonable compute resources. Unsloth provides an efficient framework for this purpose.

We have also written a sample training set for fine-tuning a Granite model. You can find it [here](/assets/2025/04/sample-training-set.txt).

Let's explore how to fine-tune a Granite model using [Unsloth](https://github.com/unsloth/unsloth):

```python
from unsloth import FastLanguageModel
import torch

# Load the Granite model
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="ibm-granite/granite-3.2-8b-instruct",
    max_seq_length=2048,  # Context length, can go up to 8192
    dtype=torch.float16,  # Use bfloat16 for newer GPUs
    load_in_4bit=True     # Enable 4-bit quantization for memory efficiency
)

# Configure for fine-tuning using QLoRA
model = FastLanguageModel.get_peft_model(
    model,
    r=16,                                  # LoRA rank
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_alpha=32,
    lora_dropout=0.05,
    bias="none",
    use_gradient_checkpointing=True,
    random_state=42,
)

# Load and process your dataset
from datasets import load_dataset
dataset = load_dataset("your_organization/custom_dataset")

def format_instruction(sample):
    return {
        "text": f"### Instruction: {sample['instruction']}\n\n### Response: {sample['response']}"
    }

formatted_dataset = dataset.map(format_instruction)

# Configure training parameters
trainer = FastLanguageModel.get_trainer(
    model,
    tokenizer,
    max_seq_length=2048,
    dataset=formatted_dataset["train"],
    per_device_train_batch_size=2,     # Adjust based on your GPU memory
    gradient_accumulation_steps=4,     # Effectively increases batch size
    max_steps=60,                       # For full runs, use num_train_epochs instead
    learning_rate=2e-4,                # Lower for more precise fine-tuning
    output_dir="./granite-finetuned"
)

# Train the model
trainer.train()

# Save the fine-tuned model
model.save_pretrained("./granite-finetuned")
```

The key parameters to adjust during fine-tuning are:

- **max_seq_length**: Controls context length; 2048 is recommended for testing
- **load_in_4bit**: Enables 4-bit quantization, reducing memory usage by 4×
- **learning_rate**: Lower values like 1e-4 or 5e-5 provide more precise fine-tuning
- **per_device_train_batch_size**: Increase for better GPU utilization
- **gradient_accumulation_steps**: Simulates larger batch sizes without increasing memory usage

For organizations with limited GPU resources, QLoRA (Quantized Low-Rank Adaptation) is particularly valuable as it enables fine-tuning on consumer GPUs while maintaining most of the quality benefits of full fine-tuning.

## Implementing RAG with Granite Models

Retrieval-Augmented Generation (RAG) systems extend LLMs with external knowledge, making them particularly valuable for enterprise contexts where models need access to company-specific information.

Let's implement a basic RAG system with our containerized Granite model:

```python
import os
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.llms import Ollama

# Load documents from a directory (your organization's knowledge base)
loader = DirectoryLoader('./company_documents', glob="**/*.pdf")
documents = loader.load()

# Split documents into manageable chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
texts = text_splitter.split_documents(documents)

# Create embeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Create a vector database
vectorstore = FAISS.from_documents(texts, embeddings)

# Initialize the Granite model via Ollama
llm = Ollama(model="granite3.2:8b", base_url="http://localhost:11434")

# Create a question-answering chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# Example query
query = "What is our company's policy on remote work?"
response = qa_chain.run(query)
print(response)
```

For more sophisticated integration, you might leverage the Model Context Protocol (MCP), which facilitates RAG capabilities within Open-WebUI:

```python
from rag_integration import MCPClient

# Initialize MCP client
client = MCPClient(
    server_address="http://localhost:11434",
    model="granite3.2:8b"
)

# Query with additional context
response = client.query(
    "Summarize our Q2 financial performance",
    context=["Financial performance for Q2 showed a 15% increase in revenue..."]
)
print(response)
```

This setup allows you to enhance your Granite model with domain-specific knowledge, producing responses grounded in your organization's data.

## Creating a Simple Web UI for Testing

To make your local Granite deployment accessible to non-technical stakeholders, a simple web UI is invaluable. Let's create one using Gradio:

```python
import gradio as gr
import requests
import json

def query_model(prompt, model_choice, temperature, max_tokens):
    # Configure endpoint based on model choice
    if "ollama" in model_choice:
        url = "http://localhost:11434/v1/chat/completions"
        model_name = model_choice.split("-")[1]  # Extract model name
    else:  # vLLM
        url = "http://localhost:8000/v1/chat/completions"
        model_name = "ibm-granite/granite-3.2-8b-instruct"
    
    # Prepare the request payload
    payload = {
        "model": model_name,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": float(temperature),
        "max_tokens": int(max_tokens)
    }
    
    # Send the request
    response = requests.post(url, json=payload)
    
    # Parse the response
    if response.status_code == 200:
        result = response.json()
        return result['choices'][0]['message']['content']
    else:
        return f"Error: {response.status_code} - {response.text}"

# Create the Gradio interface
with gr.Blocks(title="Granite Model Playground") as demo:
    gr.Markdown("# IBM Granite Model Playground")
    
    with gr.Row():
        with gr.Column():
            prompt = gr.Textbox(label="Prompt", lines=5, placeholder="Enter your prompt here...")
            model_choice = gr.Dropdown(
                label="Model", 
                choices=[
                    "ollama-granite3.2:2b", 
                    "ollama-granite3.2:8b", 
                    "vllm-granite3.2:8b-instruct"
                ],
                value="ollama-granite3.2:8b"
            )
            temperature = gr.Slider(label="Temperature", minimum=0.0, maximum=2.0, step=0.1, value=0.7)
            max_tokens = gr.Slider(label="Max Tokens", minimum=10, maximum=4096, step=10, value=1024)
            submit_btn = gr.Button("Generate")
        
        with gr.Column():
            output = gr.Textbox(label="Response", lines=10)
    
    submit_btn.click(fn=query_model, inputs=[prompt, model_choice, temperature, max_tokens], outputs=output)

# Launch the interface
demo.launch(server_name="0.0.0.0", server_port=7860)
```

This creates a simple yet effective web interface at http://localhost:7860 where users can interact with both your Ollama and vLLM deployed models.

## Tying It All Together: A Complete Local AI Stack

Let's integrate everything into a comprehensive local AI stack using docker-compose for easier management:

```yaml
version: '3'

services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    volumes:
      - ollama:/root/.ollama
    ports:
      - "11434:11434"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

  vllm:
    image: vllm/vllm-openai:latest
    container_name: vllm
    volumes:
      - ${HOME}/.cache/huggingface:/root/.cache/huggingface
    ports:
      - "8000:8000"
    command: --model ibm-granite/granite-3.2-8b-instruct
    ipc: host
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

  webapp:
    build:
      context: ./webapp
    container_name: granite-webapp
    ports:
      - "7860:7860"
    depends_on:
      - ollama
      - vllm

volumes:
  ollama:
```

Create a ./webapp/Dockerfile for the web UI:

```Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app.py .

EXPOSE 7860

CMD ["python", "app.py"]
```

Create ./webapp/requirements.txt:

```
gradio
requests
```

Place the Gradio interface code in ./webapp/app.py, then launch the entire stack:

```bash
docker-compose up -d
```

Download the necessary models:

```bash
docker exec -it ollama ollama pull granite3.2:2b
docker exec -it ollama ollama pull granite3.2:8b
```

This setup provides a complete AI stack with:
- Ollama serving Granite models for lightweight applications
- vLLM providing optimized inference for higher throughput needs
- A web UI for easy interaction
- Options for fine-tuning and RAG integration

The real beauty of this architecture lies in its complete local operation. All data stays within your infrastructure, making it ideal for sensitive enterprise environments. The smaller footprint of Granite models means you can run this setup on modest hardware, from workstations to small servers, without requiring data center-scale resources.

In a world obsessed with chasing ever-larger parameter counts, there's wisdom in choosing appropriately sized models for the task at hand. IBM's Granite models demonstrate that with careful training and optimization, smaller can indeed be better – especially when it means you can deploy AI capabilities entirely within your own infrastructure and fine-tune them to your specific needs.

So go ahead, containerize those Granite models, adapt them to your organization's knowledge domain, and enjoy the freedom of running cutting-edge AI while maintaining complete control over your data and infrastructure. In the end, the best AI isn't necessarily the biggest – it's the one that efficiently solves your specific problems while respecting your constraints.