"""One-off helper: generate a minimal text-based PDF for testing the analyzer."""
import textwrap

lines = [
    "JOHN DOE",
    "B.Tech Computer Science, 2026",
    "Skills: Python, JavaScript, React, HTML, CSS, SQL, Git",
    "Projects: E-commerce website using React and Node.js",
    "Experience: 3-month internship, web development team",
    "Interests: Full stack development, open source",
]

content_parts = ["BT", "/F1 12 Tf", "72 720 Td", "18 TL"]
for line in lines:
    safe = line.replace("(", "").replace(")", "")
    content_parts.append(f"({safe}) Tj T*")
content_parts.append("ET")
content = "\n".join(content_parts).encode()

objs = [
    b"<< /Type /Catalog /Pages 2 0 R >>",
    b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    b"<< /Length " + str(len(content)).encode() + b" >>\nstream\n" + content + b"\nendstream",
    b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
]

out = bytearray(b"%PDF-1.4\n")
offsets = []
for i, body in enumerate(objs, start=1):
    offsets.append(len(out))
    out += f"{i} 0 obj\n".encode() + body + b"\nendobj\n"

xref_pos = len(out)
out += f"xref\n0 {len(objs) + 1}\n".encode()
out += b"0000000000 65535 f \n"
for off in offsets:
    out += f"{off:010d} 00000 n \n".encode()
out += (
    f"trailer\n<< /Size {len(objs) + 1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF\n".encode()
)

with open("test-resume.pdf", "wb") as f:
    f.write(bytes(out))
print("written test-resume.pdf", len(out), "bytes")
