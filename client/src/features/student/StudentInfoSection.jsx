import { useOrder } from "../../context/OrderContext";
import SectionWrapper from "../../components/ui/SectionWrapper";
import Input from "../../components/ui/Input";

export default function StudentInfoSection() {
  const { student, studentErrors, dispatch } = useOrder();

  const update = (field, value) => {
    dispatch({
      type: "SET_STUDENT",
      payload: { [field]: value },
      errors: { [field]: undefined },
    });
  };

  return (
    <SectionWrapper
      id="student-info"
      step="2"
      title="Student Information"
      description="Required for order tracking and pickup verification."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="name"
          label="Full Name *"
          placeholder="Enter your full name"
          value={student.name}
          onChange={(e) => update("name", e.target.value)}
          error={studentErrors.name}
          className="sm:col-span-2"
        />
        <Input
          id="mobile"
          label="Mobile Number *"
          placeholder="10-digit mobile number"
          inputMode="numeric"
          maxLength={10}
          value={student.mobileNumber}
          onChange={(e) =>
            update(
              "mobileNumber",
              e.target.value.replace(/\D/g, "").slice(0, 10),
            )
          }
          error={studentErrors.mobileNumber}
        />
        <Input
          id="prn"
          label="College PRN *"
          placeholder="Enter your PRN"
          value={student.prn}
          onChange={(e) => update("prn", e.target.value)}
          error={studentErrors.prn}
        />
      </div>
    </SectionWrapper>
  );
}
