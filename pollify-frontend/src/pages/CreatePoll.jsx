import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { Plus, Trash2, Upload, User } from "lucide-react";
import { toast } from "react-toastify";

const pollTypes = [
  { key: "single", label: "Single Choice", icon: "list" },
  { key: "yesno", label: "Yes / No", icon: "toggle" },
  { key: "rating", label: "Rating", icon: "star" },
  { key: "image", label: "Image", icon: "image" },
  { key: "open", label: "Open Ended", icon: "message" },
];

export default function CreatePoll() {
  const navigate = useNavigate();

  // Consolidated Single State
  const [formData, setFormData] = useState({
    type: "single",
    question: "",
    category: "",
    options: ["", ""],
    images: [null, null],
    previews: ["", ""],
    loading: false,
  });

  const { type, question, category, options, images, previews, loading } =
    formData;

  function updateField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function updateOption(i, val) {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((o, idx) => (idx === i ? val : o)),
    }));
  }

  function addOption() {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
      images: [...prev.images, null],
      previews: [...prev.previews, ""],
    }));
  }

  function removeOption(i) {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, idx) => idx !== i),
      images: prev.images.filter((_, idx) => idx !== i),
      previews: prev.previews.filter((_, idx) => idx !== i),
    }));
  }

  function handleImageChange(i, file) {
    if (!file) return;

    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages[i] = file;

      const newPreviews = [...prev.previews];
      newPreviews[i] = URL.createObjectURL(file);

      return {
        ...prev,
        images: newImages,
        previews: newPreviews,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    updateField("loading", true);

    try {
      const rawToken = localStorage.getItem("token");
      // console.log(rawToken.token);
      // const token1 = rawToken ? JSON.parse(rawToken) : null;
      console.log("RawToken: " + rawToken);

      // Clean quotes and sanitize token string
      const token = rawToken ? rawToken.replace(/^"(.*)"$/, "$1").trim() : null;
      console.log("Token: " + token);

      if (!token || token === "undefined" || token === "null") {
        toast.error("Session expired or missing token. Please log in again.");
        updateField("loading", false);
        return;
      }

      let response;

      if (type === "image") {
        const validFiles = images.filter(Boolean);
        if (validFiles.length < 2) {
          toast.error("Please upload at least 2 images.");
          updateField("loading", false);
          return;
        }

        const payload = new FormData();
        payload.append("question", question);
        payload.append("type", type);
        if (category) payload.append("category", category);

        images.forEach((file) => {
          if (file) payload.append("files", file);
        });

        response = await fetch("http://localhost:3500/api/polls/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        });
      } else {
        const payload = {
          question,
          type,
          category,
          options: type === "single" ? options.filter((o) => o.trim()) : [],
        };

        response = await fetch("http://localhost:3500/api/polls/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create poll.");
      }

      toast.success("Poll created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      updateField("loading", false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-1">Create a poll</h1>
      <p className="text-[var(--color-text-muted)] mb-6">
        Ask the community what they think.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-6"
      >
        <div>
          <p className="text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-3">
            POLL TYPE
          </p>
          <div className="flex flex-wrap gap-2">
            {pollTypes.map((t) => (
              <button
                type="button"
                key={t.key}
                onClick={() => updateField("type", t.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors focus-ring ${
                  type === t.key
                    ? "bg-[var(--color-brand)]/10 border-[var(--color-brand)] text-[var(--color-brand)]"
                    : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
                }`}
              >
                <Icon name={t.icon} size={15} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-2">
            QUESTION
          </label>
          <input
            required
            value={question}
            onChange={(e) => updateField("question", e.target.value)}
            placeholder="What do you want to ask?"
            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 text-sm outline-none focus:border-[var(--color-brand)]/60 placeholder:text-[var(--color-text-faint)]"
          />
        </div>

        {type === "single" && (
          <div>
            <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-2">
              OPTIONS
            </label>
            <div className="flex flex-col gap-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-7 h-7 shrink-0 rounded-full bg-[var(--color-border)] flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-brand)]/60 placeholder:text-[var(--color-text-faint)]"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="text-[var(--color-text-faint)] hover:text-red-400 focus-ring rounded p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand)] mt-3 hover:underline focus-ring rounded"
            >
              <Plus size={15} />
              Add option
            </button>
          </div>
        )}

        {type === "image" && (
          <div>
            <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-2">
              IMAGE OPTIONS (MINIMUM 2)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative h-32 border-2 border-dashed border-[var(--color-border)] rounded-xl flex flex-col items-center justify-center overflow-hidden bg-[var(--color-bg)] hover:border-[var(--color-brand)] transition-colors"
                >
                  {src ? (
                    <img
                      src={src}
                      alt="Option preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full p-2">
                      <Upload
                        size={20}
                        className="text-[var(--color-text-faint)] mb-1"
                      />
                      <span className="text-xs text-[var(--color-text-muted)]">
                        Upload Image {i + 1}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(i, e.target.files[0])
                        }
                      />
                    </label>
                  )}
                  {previews.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand)] mt-3 hover:underline focus-ring rounded"
            >
              <Plus size={15} />
              Add image field
            </button>
          </div>
        )}

        {type === "yesno" && (
          <p className="text-sm text-[var(--color-text-muted)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-3">
            Voters will choose between{" "}
            <strong className="text-[var(--color-text)]">Yes</strong> and{" "}
            <strong className="text-[var(--color-text)]">No</strong>.
          </p>
        )}
        {type === "rating" && (
          <p className="text-sm text-[var(--color-text-muted)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-3">
            Voters will rate this on a 1-5 star scale.
          </p>
        )}
        {type === "open" && (
          <p className="text-sm text-[var(--color-text-muted)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-3">
            Voters will respond with their own free-text answer.
          </p>
        )}

        <div>
          <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-2">
            CATEGORY (OPTIONAL)
          </label>
          <input
            value={category}
            onChange={(e) => updateField("category", e.target.value)}
            placeholder="e.g. Sports, Tech, Education"
            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 text-sm outline-none focus:border-[var(--color-brand)]/60 placeholder:text-[var(--color-text-faint)]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-brand)] text-black font-semibold rounded-lg py-3 hover:bg-[var(--color-brand-dim)] transition-colors focus-ring disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? "Posting..." : "Post poll"}
        </button>
      </form>
    </div>
  );
}
