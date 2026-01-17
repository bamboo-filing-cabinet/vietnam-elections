export default function ContactPage() {
  return (
    <div className="grid gap-6 stagger">
      <section className="rounded-3xl border-2 border-[var(--border)] border-t-4 border-t-[var(--flag-red)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_rgba(218,37,29,0.35)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--flag-red-deep)]">Contact</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ink)]">
          Corrections, questions, suggestions
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
          Liên hệ
        </p>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          Vietnam Elections is a sourced directory. If you spot an error or have a
          question, we welcome corrections and suggestions through the channels below.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)]">
          Nếu bạn phát hiện sai sót hoặc có câu hỏi, vui lòng gửi góp ý qua các kênh bên
          dưới.
        </p>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Preferred: GitHub Issues</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
          Ưu tiên: GitHub Issues
        </p>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Best for corrections, missing sources, or data questions. Please include a
          source link and retrieval date if you have them (helpful, not required).
        </p>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Ưu tiên cho đính chính, bổ sung nguồn, hoặc câu hỏi dữ liệu. Nếu có thể, vui
          lòng kèm liên kết nguồn và ngày truy xuất (không bắt buộc).
        </p>
        <a
          className="mt-4 inline-flex text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)] hover:text-[var(--flag-red)]"
          href="https://github.com/VietThan/vietnam-elections/issues"
          rel="noreferrer"
          target="_blank"
        >
          Open GitHub Issues
        </a>
      </section>

      <section className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Anonymous option</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
          Ẩn danh
        </p>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Use the Google Form if you prefer not to sign in. Submissions are reviewed and
          verified against sources; we may not be able to reply directly.
        </p>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Nếu muốn ẩn danh, bạn có thể dùng Google Form. Các góp ý sẽ được kiểm tra lại
          với nguồn; có thể không phản hồi trực tiếp.
        </p>
        <a
          className="mt-4 inline-flex text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)] hover:text-[var(--flag-red)]"
          href="https://forms.gle/UaPUdJZ5SGrTKdr2A"
          rel="noreferrer"
          target="_blank"
        >
          Open Google Form
        </a>
      </section>

      <section className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-6 text-sm text-[var(--ink-muted)]">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--flag-red-deep)]">
          Gợi ý
        </p>
        <p>
          Helpful (optional): source link, document title/date, page number, or a
          screenshot that points to the issue.
        </p>
        <p className="mt-2">
          Gợi ý (không bắt buộc): liên kết nguồn, tên/ngày tài liệu, số trang, hoặc ảnh
          chụp liên quan.
        </p>
      </section>
    </div>
  );
}
