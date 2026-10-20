import { useEffect, useState } from "react";
import { addRock, deleteRock, reviseRock, watchRocks } from "../rocks.js";
import { revisionChoices, when } from "../revisions.js";
import { downloadCSV } from "../csv.js";

export default function Journal({ uid }) {
  const [rocks, setRocks] = useState(null);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(null); // rock id
  // Version picked per rock this session; every rock opens on its newest.
  const [picked, setPicked] = useState({});

  useEffect(() => watchRocks(uid, setRocks, (e) => setError(e.message)), [uid]);

  const visible = rocks ?? [];

  const save = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    addRock(uid, draft)?.catch((err) => setError(err.message));
    setDraft("");
  };

  const act = (promise) => promise.catch((err) => setError(err.message));

  return (
    <section className="stack-lg">
      <form className="card composer" onSubmit={save}>
        <label htmlFor="draft" className="sr-only">
          New rock
        </label>
        <textarea
          id="draft"
          rows={4}
          placeholder="Drop a rock — a thought, a line, a first draft."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save(e);
          }}
        />
        <div className="row">
          <span className="fine">⌘↵ to save</span>
          <button className="btn btn-primary" disabled={!draft.trim()}>
            Save
          </button>
        </div>
      </form>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <div className="row">
        <span />
        <button className="btn btn-quiet" disabled={!rocks?.length} onClick={() => downloadCSV(rocks)}>
          Export CSV
        </button>
      </div>

      {rocks === null ? (
        <p className="muted center">Loading your rocks…</p>
      ) : visible.length === 0 ? (
        <p className="muted center empty">
          No rocks yet. Write something above.
        </p>
      ) : (
        <ul className="rocks">
          {visible.map((rock) => {
            const latest = rock.revisions.length - 1;
            const index = picked[rock.id] ?? latest;
            const shownText = rock.revisions[index]?.text ?? rock.text;
            const older = index < latest;
            return (
            <li key={rock.id} className="card rock">
              {editing === rock.id ? (
                <RockEditor
                  rock={{ ...rock, text: shownText }}
                  onCancel={() => setEditing(null)}
                  onSave={(text) => {
                    setEditing(null);
                    if (!older) {
                      act(reviseRock(uid, { ...rock, text: rock.revisions[latest].text, revisionIndex: latest }, text, "edited"));
                    } else if (text.trim() !== shownText && window.confirm("This is an older version. Branch into a new rock? The original stays as it is.")) {
                      // As on iOS: changes to an older version always branch.
                      addRock(uid, text)?.catch((err) => setError(err.message));
                      setPicked((p) => ({ ...p, [rock.id]: latest }));
                    }
                  }}
                />
              ) : (
                <>
                  <p className="rock-text">{shownText}</p>
                  <div className="row">
                    {rock.revisions.length > 1 && (
                      <label className="history">
                        <span className="sr-only">Version</span>
                        <select value={index} onChange={(e) => setPicked((p) => ({ ...p, [rock.id]: Number(e.target.value) }))}>
                          {revisionChoices(rock).map((c) => (
                            <option key={c.index} value={c.index}>
                              {c.isLatest ? `Latest · ${when(c.date)}` : when(c.date)}
                            </option>
                          ))}
                        </select>
                        {older && <span className="fine branch-note">editing branches a new rock</span>}
                      </label>
                    )}
                    <time className="fine" dateTime={rock.createdAt.toISOString()}>
                      {rock.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </time>
                    <div className="actions">
                      <button className="btn btn-quiet" onClick={() => setEditing(rock.id)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-quiet danger"
                        onClick={() => window.confirm("Delete this rock?") && act(deleteRock(uid, rock))}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function RockEditor({ rock, onSave, onCancel }) {
  const [text, setText] = useState(rock.text);
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(text);
      }}
    >
      <textarea rows={5} autoFocus value={text} onChange={(e) => setText(e.target.value)} aria-label="Edit rock" />
      <div className="actions">
        <button type="button" className="btn btn-quiet" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}
