export interface CodePreset {
  id: string;
  name: string;
  language: string;
  filename: string;
  description: string;
  category: 'Security' | 'Performance' | 'Concurrency' | 'Architecture' | 'Cloud/GCP';
  code: string;
}

export const CODE_PRESETS: CodePreset[] = [
  {
    id: 'python-sql-injection',
    name: 'Python: Auth & SQL Injection Vulnerability',
    language: 'python',
    filename: 'auth_service.py',
    category: 'Security',
    description: 'Direct string concatenation in database query, plain text password comparison, and unhandled connection exception.',
    code: `import sqlite3
import hashlib

def authenticate_user(username, raw_password):
    # CRITICAL: Vulnerable to SQL Injection
    conn = sqlite3.connect("production_users.db")
    cursor = conn.cursor()
    
    query = f"SELECT id, role, password_hash FROM users WHERE username = '{username}'"
    cursor.execute(query)
    user = cursor.fetchone()
    
    # Insecure direct comparison without salt or constant-time comparison
    if user and user[2] == raw_password:
        print(f"[SECURITY WARNING] User {username} logged in with plain text password!")
        return {"user_id": user[0], "role": user[1], "auth": True}
    
    # Missing conn.close() leaking database file descriptor
    return {"auth": False}

def batch_process_orders(order_ids):
    # N+1 query problem inside loop
    results = []
    conn = sqlite3.connect("production_users.db")
    for oid in order_ids:
        cur = conn.cursor()
        cur.execute(f"SELECT * FROM orders WHERE id = {oid}")
        results.append(cur.fetchone())
    return results
`
  },
  {
    id: 'typescript-concurrency-leak',
    name: 'TypeScript: Async Race Condition & Memory Leak',
    language: 'typescript',
    filename: 'userSessionManager.ts',
    category: 'Concurrency',
    description: 'Shared state race conditions, missing AbortController, unhandled promise rejections, and global event listener accumulation.',
    code: `import { EventEmitter } from 'events';

const globalEmitter = new EventEmitter();
const userCache = new Map<string, any>();

export class UserSessionManager {
  private activeSessions = 0;

  public async fetchAndCacheUser(userId: string): Promise<any> {
    // Race condition: Check-then-act without locking or atomic memoization
    if (userCache.has(userId)) {
      return userCache.get(userId);
    }

    this.activeSessions++;

    // Unhandled promise rejection if fetch fails
    const response = await fetch(\`https://api.internal.service/users/\${userId}\`);
    const data = await response.json();

    // Memory leak: Global listener registered per user fetch without cleanup
    globalEmitter.on('session:ping', (ping) => {
      console.log(\`User \${userId} received ping:\`, ping);
    });

    userCache.set(userId, data);
    this.activeSessions--;
    return data;
  }

  public purgeAll(): void {
    // Danger: Mutating cache without notifying active consumers
    userCache.clear();
  }
}
`
  },
  {
    id: 'golang-goroutine-leak',
    name: 'Go: Goroutine Leak & Nil Pointer Dereference',
    language: 'go',
    filename: 'worker_pool.go',
    category: 'Concurrency',
    description: 'Unbuffered channel deadlock, goroutine leak on timeout, and missing nil checks on error returns.',
    code: `package main

import (
	"context"
	"fmt"
	"time"
)

type JobResult struct {
	Data string
	Err  error
}

func ProcessJobWithTimeout(ctx context.Context, jobID string) (*JobResult, error) {
	// BUG: Unbuffered channel will cause goroutine to leak if timeout expires first
	ch := make(chan *JobResult)

	go func() {
		time.Sleep(2 * time.Second) // simulate heavy work
		ch <- &JobResult{Data: "job completed: " + jobID, Err: nil}
	}()

	select {
	case res := <-ch:
		return res, nil
	case <-time.After(500 * time.Millisecond):
		// Goroutine above is now blocked forever writing to 'ch'
		return nil, fmt.Errorf("job timed out")
	}
}

func ExecuteTask(res *JobResult) {
	// CRITICAL: Nil pointer dereference if res is nil
	fmt.Printf("Data length: %d\\n", len(res.Data))
}
`
  },
  {
    id: 'dockerfile-gcp-insecure',
    name: 'Dockerfile: Root User & Leaked Secrets',
    language: 'dockerfile',
    filename: 'Dockerfile',
    category: 'Cloud/GCP',
    description: 'Running as root, copying sensitive .env secrets, heavy base image without multi-stage build, and missing HEALTHCHECK.',
    code: `FROM node:20

# ANTI-PATTERN: Running directly as root user
WORKDIR /app

# INSECURE: Copying entire directory including .env, git history, and secrets
COPY . .

# Hardcoded build argument with sensitive token
ARG GITHUB_TOKEN="ghp_9847192837192837192837123"
ENV API_KEY="AIzaSyA87192837192837192837"

RUN npm install

# Missing non-root user creation: USER node
EXPOSE 8080

# No HEALTHCHECK defined for Cloud Run container liveness probe
CMD ["node", "dist/server.js"]
`
  },
  {
    id: 'rust-unsafe-concurrency',
    name: 'Rust: Unchecked Unsafe Block & Potential Panic',
    language: 'rust',
    filename: 'packet_buffer.rs',
    category: 'Security',
    description: 'Unsafe pointer dereference without bounds checking, unwrap() on untrusted input causing panics in production.',
    code: `pub struct PacketBuffer {
    buffer: Vec<u8>,
}

impl PacketBuffer {
    pub fn new(capacity: usize) -> Self {
        PacketBuffer {
            buffer: Vec::with_capacity(capacity),
        }
    }

    pub fn read_packet_header(&self) -> u32 {
        // PANIC: unwrap() on unchecked slice will panic if len < 4
        let slice = &self.buffer[0..4];
        let bytes: [u8; 4] = slice.try_into().unwrap();
        u32::from_be_bytes(bytes)
    }

    pub fn unsafe_read_offset(&self, offset: usize) -> u8 {
        // CRITICAL: Undefined Behavior if offset >= capacity or buffer not initialized
        unsafe {
            let ptr = self.buffer.as_ptr();
            *ptr.add(offset)
        }
    }
}
`
  },
  {
    id: 'gcp-terraform-misconfig',
    name: 'Terraform: Public GCP Bucket & Weak IAM Policy',
    language: 'terraform',
    filename: 'main.tf',
    category: 'Cloud/GCP',
    description: 'Cloud Storage bucket without uniform access prevention, allUsers public viewer permission, and plaintext database password.',
    code: `resource "google_storage_bucket" "artifacts" {
  name          = "company-production-review-artifacts"
  location      = "US"
  force_destroy = true
  
  # SECURITY RISK: Public read access enabled to everyone on the internet
  uniform_bucket_level_access = false
}

resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.artifacts.name
  role   = "roles/storage.objectViewer"
  member = "allUsers" # CRITICAL: Open to world
}

resource "google_sql_database_instance" "master" {
  name             = "master-db"
  database_version = "POSTGRES_15"
  region           = "us-central1"

  settings {
    tier = "db-f1-micro"
    ip_configuration {
      # SECURITY: Public IP authorized without whitelist restriction
      ipv4_enabled = true
      authorized_networks {
        name  = "all"
        value = "0.0.0.0/0"
      }
    }
  }
}
`
  }
];
