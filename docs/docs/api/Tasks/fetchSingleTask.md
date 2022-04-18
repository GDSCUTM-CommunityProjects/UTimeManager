---
title: Fetch Single Task
---

export const Endpoint = ({children, color}) => ( <span style={{
borderRadius: '2px',
color: '#E83E8C',
}}>{children}</span> );

<Endpoint>GET /tasks/task/:id</Endpoint>: Fetching a single Task

```json
{}
```

### Example Request

This is a **protected route**, a **valid JWT is required** in the header field

#### Header

```
Cookie:
token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTU4MjQyNzUsImlhdCI6IjIwMjAtMDctMjdUMDA6MjY6MTUuNzg5NTg0Mi0wNDowMCIsInN1YiI6ImNocmlzIn0.5US2_ITKcfgkpEbfsR-gxXbGPFY6XsgJPcGA5qaBD1M
```

#### Parameters

id: task_id

### Possible Responses

#### Immediate Success

```json
{
  "data": {
    // Task information
  }
}
```

#### Failure

```json
{
  "message": "Not Authorized, token failed"
}
```

```json
{
  "message": "Could not fetch doc"
}
```
