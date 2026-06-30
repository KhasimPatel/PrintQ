import { useOrder } from "../../context/OrderContext";
import SectionWrapper from "../../components/ui/SectionWrapper";
import Toggle from "../../components/ui/Toggle";
import Input from "../../components/ui/Input";

function OptionGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-text">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
              value === opt.value
                ? "border-primary bg-primary-light text-text"
                : "border-border bg-surface text-text-muted hover:border-primary/40"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PrintSettingsSection() {
  const { settings, dispatch } = useOrder();

  const set = (payload) => dispatch({ type: "SET_SETTINGS", payload });

  return (
    <SectionWrapper
      id="settings"
      step="4"
      title="Print Configuration"
      description="Choose print type, mode, copies, and urgency."
    >
      <div className="space-y-5">
        <OptionGroup
          label="Print Type"
          value={settings.colorType}
          onChange={(v) => set({ colorType: v })}
          options={[
            { value: "bw", label: "Black & White" },
            { value: "color", label: "Color" },
          ]}
        />

        <OptionGroup
          label="Print Mode"
          value={settings.printMode}
          onChange={(v) => set({ printMode: v })}
          options={[
            { value: "single", label: "Single Side" },
            { value: "double", label: "Double Side" },
          ]}
        />

        <Input
          id="copies"
          label="Copies"
          type="number"
          min={1}
          max={5}
          value={settings.copies}
          onChange={(e) =>
            set({
              copies: Math.max(1, Math.min(99, Number(e.target.value) || 1)),
            })
          }
        />

        <Toggle
          id="urgent"
          label="Urgent Printing"
          description="Adds ₹1 per sheet. Priority processing at the shop."
          checked={settings.isUrgent}
          onChange={(v) => set({ isUrgent: v })}
        />
      </div>
    </SectionWrapper>
  );
}
