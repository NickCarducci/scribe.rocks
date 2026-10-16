import { useEffect, useMemo, useState } from "react";
import { addRock, deleteRock, reviseRock, showRevision, updateRock, watchRocks } from "../rocks.js";
import { downloadCSV } from "../csv.js";

const FILTERS = ["All", "Rocks", "Diamonds"];

export default function Journal({ uid }) {
  const [rocks, setRocks] = useState(null);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null); // rock id

  useEffect(() => watchRocks(uid, setRocks, (e) => setError(e.message)), [uid]);

  const visible = useMemo(() => {
    if (!rocks) return [];
    if (filter === "Rocks") return rocks.filter((r) => !r.isDiamond);
    if (filter === "Diamonds") return rocks.filter((r) => r.isDiamond);
    return rocks;
  }, [rocks, filter]);

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
        <div className="segmented" role="tablist" aria-label="Filter">
          {FILTERS.map((f) => (
            <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <button className="btn btn-quiet" disabled={!rocks?.length} onClick={() => downloadCSV(rocks)}>
          Export CSV
        </button>
      </div>

      {rocks === null ? (
        <p className="muted center">Loading your rocks…</p>
      ) : visible.length === 0 ? (
        <p className="muted center empty">
          {rocks.length === 0 ? "No rocks yet. Write something above." : `No ${filter.toLowerCase()} yet.`}
        </p>
      ) : (
        <ul className="rocks">
          {visible.map((rock) => (
            <li key={rock.id} className={`card rock${rock.isDiamond ? " diamond" : ""}`}>
              {editing === rock.id ? (
                <RockEditor
                  rock={rock}
                  onCancel={() => setEditing(null)}
                  onSave={(text) => {
                    setEditing(null);
                    act(reviseRock(uid, rock, text, "edited"));
                  }}
                />
              ) : (
                <>
                  <p className="rock-text">{rock.text}</p>
                  <div className="row">
                    {rock.revisions.length > 1 && (
                      <div className="history" aria-label="Revisions">
                        <button
                          className="btn btn-quiet chevron"
                          aria-label="Previous revision"
                          disabled={rock.revisionIndex === 0}
                          onClick={() => act(showRevision(uid, rock, rock.revisionIndex - 1))}
                        >
                          ‹
                        </button>
                        <span className="fine">
                          {rock.revisionIndex + 1} of {rock.revisions.length}
                        </span>
                        <button
                          className="btn btn-quiet chevron"
                          aria-label="Next revision"
                          disabled={rock.revisionIndex === rock.revisions.length - 1}
                          onClick={() => act(showRevision(uid, rock, rock.revisionIndex + 1))}
                        >
                          ›
                        </button>
                      </div>
                    )}
                    <time className="fine" dateTime={rock.createdAt.toISOString()}>
                      {rock.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </time>
                    <div className="actions">
                      <button
                        className="btn btn-quiet"
                        aria-pressed={rock.isDiamond}
                        title={rock.isDiamond ? "Back to rock" : "Mark as final draft"}
                        onClick={() => act(updateRock(uid, rock, { isDiamond: !rock.isDiamond }))}
                      >
                        {rock.isDiamond ? "◆ Diamond" : "◇ Diamond"}
                      </button>
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
          ))}
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
