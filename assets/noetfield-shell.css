/* ===== RID (Request ID) mini UI ===== */
.ridRow{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  align-items:center;
  margin-top:10px;
}

/* RID code pill */
.ridRow code[data-rid]{
  display:inline-flex;
  align-items:center;
  max-width: 100%;
  padding:6px 10px;
  border-radius:12px;
  border:1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.03);
  color: var(--text);
  font-size:12px;
  line-height:1.2;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

/* Copy button (scoped) */
.ridRow button[data-copy-rid]{
  appearance:none;
  border:1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.03);
  color: var(--muted);
  padding:8px 10px;
  border-radius:14px;
  cursor:pointer;
  font-size:12.5px;
  line-height:1.2;
  transition: background .15s ease, border-color .15s ease, color .15s ease, transform .06s ease;
  user-select:none;
}

.ridRow button[data-copy-rid]:hover{
  color: var(--text);
  border-color: rgba(200,163,73,.38);
  background: rgba(200,163,73,.10);
}

.ridRow button[data-copy-rid]:active{ transform: translateY(1px); }

.ridRow button[data-copy-rid][data-copied="1"]{
  border-color: rgba(45,227,138,.55);
  background: rgba(45,227,138,.10);
  color: var(--text);
}

/* Accessibility: focus ring aligned to shell */
.ridRow button[data-copy-rid]:focus-visible{
  outline:none;
  box-shadow: var(--focus);
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce){
  .ridRow button[data-copy-rid]{ transition:none; }
}
