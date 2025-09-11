# Deployment Pipeline Summary

This document provides an overview of the enhanced CI/CD pipeline with automatic Coolify deployment.

## Pipeline Overview

```
┌─────────────────┐    ┌────────────────────────┐    ┌─────────────────┐
│   Push to Main  │───▶│  Build & Push Two      │───▶│ Deploy Both     │
│                 │    │  Docker Images         │    │ Services in     │
│                 │    │  (Parallel)            │    │ Parallel        │
└─────────────────┘    └────────────────────────┘    └─────────────────┘

┌─────────────────┐    ┌────────────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Semantic Release│───▶│  Build & Push Two      │───▶│ Update Release  │───▶│ Deploy Both     │
│                 │    │Multi-Arch Images       │    │   with Docker   │    │ Services in     │
│                 │    │  (Parallel)            │    │                 │    │ Parallel        │
└─────────────────┘    └────────────────────────┘    └─────────────────┘    └─────────────────┘
```

## Workflows

### 1. Development Workflow (`staging.yml`)

**Triggers:**

- Push to `main` branch
- Manual workflow dispatch

**Process:**

1. Build two Docker images in parallel:
   - Main app: `mlnative/paperjet-dev:{sha}`
   - ML service: `mlnative/paperjet-ml-dev:{sha}`
2. Push both images to Docker Hub
3. Deploy both services to staging in parallel:
   - Main app deployment job
   - ML service deployment job

**Environment:** `staging`

### 2. Production Workflow (`release.yml`)

**Triggers:**

- Manual workflow dispatch only

**Process:**

1. Create semantic release (if changes warrant it)
2. Build multi-platform Docker images in parallel:
   - Main app: `mlnative/paperjet:{version}`, `mlnative/paperjet:latest`
   - ML service: `mlnative/paperjet-ml:{version}`, `mlnative/paperjet-ml:latest`
3. Push both images to Docker Hub
4. Update GitHub release with Docker info for both images
5. Deploy both services to production in parallel:
   - Main app deployment job
   - ML service deployment job

## Key Features

### ✅ Automatic Deployment

- No manual intervention required
- Deploys immediately after successful image build

### ✅ Environment Separation

- Separate dev/prod environments with different configurations
- Uses GitHub Environments for security

### ✅ Image Tag Management

- Development: Uses commit SHA for traceability
- Production: Uses semantic versioning + latest tag

### ✅ Error Handling

- Deployment only triggers on successful image builds
- PR builds don't trigger deployments
- Comprehensive error reporting

### ✅ Parallel Deployments

- Main app and ML service deploy simultaneously
- Faster deployment times through parallelization
- Independent failure handling for each service
- Reduced overall deployment duration

### ✅ Security

- API tokens stored as GitHub secrets
- Environment-based access controls
- No sensitive data in workflow files

## Image Strategy

### Development Images

- **Main Application Repository**: `mlnative/paperjet-dev`
- **ML Service Repository**: `mlnative/paperjet-ml-dev`
- **Tags**:
  - `{sha}` (each commit - 7-character git hash)
  - `latest` (latest main branch)
  - `{date}-{sha}` (daily builds)

### Production Images

- **Main Application Repository**: `mlnative/paperjet`
- **ML Service Repository**: `mlnative/paperjet-ml`
- **Tags**:
  - `{version}` (e.g., `1.2.3`)
  - `{major}.{minor}` (e.g., `1.2`)
  - `{major}` (e.g., `1`)
  - `latest`

## Benefits

1. **Faster Deployments**: Automatic deployment reduces time from code to production
2. **Parallel Processing**: Main app and ML service deploy simultaneously for speed
3. **Consistency**: Same process for every deployment reduces human error
4. **Traceability**: Clear mapping between commits, images, and deployments
5. **Rollback Capability**: Easy to revert to previous image versions
6. **Monitoring**: All deployments logged in GitHub Actions
