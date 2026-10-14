
import { useRef, useState } from "react";
import {
  ArrowRight, ArrowLeft, Check, CheckCircle2, Sprout, Users,
  Building2, Handshake, Wallet, ShieldCheck, FileText, Upload,
  X, UserRound, MapPin, BriefcaseBusiness, ClipboardCheck,
} from "lucide-react";

const GREEN = "#176b45";

const categories = [
  {
    id: "farmer", name: "Farmer Member", fee: "₦3,000",
    description: "Individual farmers and smallholder growers.",
    icon: Sprout,
    downloads: ["/forms/farmer-membership-form.pdf"],
    downloadNames: ["Download offline farmer form"],
    steps: [
      { title: "Personal information", subtitle: "Tell us who you are.", fields: [
        ["Full name", "name", "text", true],
        ["National Identity Number (NIN)", "nin", "text", true],
        ["Email address", "email", "email", true],
        ["Phone number", "phone", "tel", true],
        ["Alternative phone number", "alt-phone", "tel"],
      ]},
      { title: "Location and farm", subtitle: "Where do you live and farm?", fields: [
        ["State", "state", "text", true],
        ["Local government area", "lga"],
        ["Community / village", "community"],
        ["Residential address", "address", "text", true],
        ["Alternative or farm address", "alt-address"],
        ["Primary crop", "crop", "text", false, "e.g. Cassava"],
        ["Farm size (acres / hectares)", "farm-size"],
        ["Cooperative (if any)", "cooperative"],
      ]},
      { title: "Business and contacts", subtitle: "Add business details and trusted contacts.", fields: [
        ["Farm business name", "business-name"],
        ["Business registration number", "business-reg-number"],
        ["Website address", "website", "url"],
        ["Social media link", "social-media", "url"],
        ["Contact person 1 full name", "contact-person-1-name", "text", true],
        ["Contact person 1 phone", "contact-person-1-phone", "tel", true],
        ["Contact person 1 relationship", "contact-person-1-relationship"],
        ["Contact person 2 full name", "contact-person-2-name"],
        ["Contact person 2 phone", "contact-person-2-phone", "tel"],
        ["Contact person 2 relationship", "contact-person-2-relationship"],
      ]},
      { title: "Supporting documents", subtitle: "Upload your photograph and proof of identity.", fields: [
        ["Passport photograph", "passport-photo", "file", true, "", "image/jpeg,image/png,image/webp", false, "JPG, PNG or WebP; maximum 5 MB."],
        ["Proof of identity", "identity-document", "file", true, "", "image/jpeg,image/png,application/pdf", false, "PDF or image; maximum 10 MB."],
      ]},
    ],
  },
  {
    id: "cooperative-new", name: "New Cooperative", fee: "₦50,000",
    description: "For new cooperative societies and organised groups.",
    icon: Users,
    downloads: ["/forms/new-cooperative-registration-form.pdf"],
    downloadNames: ["Download offline cooperative form"],
    steps: [
      { title: "Cooperative details", subtitle: "Introduce your society.", fields: [
        ["Cooperative society name", "org", "text", true],
        ["Type of cooperative", "cooperative-type", "select", true, ["Agricultural", "Livestock", "Processing", "Marketing", "Multipurpose", "Other"]],
        ["State of registration / operation", "state", "text", true],
        ["Local government area", "lga"],
        ["Estimated number of members", "members", "number", false, "", "", false, "", "1"],
        ["Business registration number", "business-reg-number", "text", false, "CAC / cooperative registration number"],
      ]},
      { title: "Leadership", subtitle: "Provide your principal leader's details.", fields: [
        ["Leader's full name", "leader-name", "text", true],
        ["Leader's NIN", "leader-nin", "text", true],
        ["Leader's address", "leader-address", "text", true],
        ["Leader's social media link", "leader-social-media", "url"],
        ["Additional leader 1 full name", "leader-2-name"],
        ["Additional leader 1 NIN", "leader-2-nin"],
        ["Additional leader 1 address", "leader-2-address"],
        ["Additional leader 1 social media", "leader-2-social-media", "url"],
        ["Additional leader 2 full name", "leader-3-name"],
        ["Additional leader 2 NIN", "leader-3-nin"],
        ["Additional leader 2 address", "leader-3-address"],
        ["Additional leader 2 social media", "leader-3-social-media", "url"],
      ]},
      { title: "Contact and activities", subtitle: "How can we reach your society?", fields: [
        ["Office address 1", "office-address-1", "text", true],
        ["Office address 2", "office-address-2"],
        ["Contact person", "contact", "text", true],
        ["Phone number", "phone", "tel", true],
        ["Alternative phone number", "alt-phone", "tel"],
        ["Email address", "email", "email", true],
        ["Website address", "website", "url"],
        ["Social media link", "social-media", "url"],
        ["Cooperative purpose and activities", "details", "textarea"],
      ]},
      { title: "Documents", subtitle: "Upload your cooperative records.", fields: [
        ["Cooperative logo", "logo", "file", true, "", "image/jpeg,image/png,image/svg+xml", false, "JPG, PNG or SVG; maximum 5 MB."],
        ["Registration documents", "registration-documents", "file", true, "", "application/pdf,image/jpeg,image/png", true, "Select all required supporting files."],
      ]},
    ],
  },
  {
    id: "cooperative-old", name: "Cooperative Revalidation", fee: "₦25,000",
    description: "Renew or update an existing cooperative's records.",
    icon: ShieldCheck,
    downloads: ["/forms/cooperative-revalidation-form.pdf"],
    downloadNames: ["Download revalidation form"],
    steps: [
      { title: "Existing cooperative", subtitle: "Identify your registered society.", fields: [
        ["Old cooperative society name", "org", "text", true],
        ["Registration number", "reg-number", "text", true],
        ["State of registration / operation", "state", "text", true],
        ["Local government area", "lga"],
        ["Year established", "year", "text", false, "e.g. 2017"],
        ["Current status", "status", "text", false, "e.g. Active"],
        ["Estimated number of members", "members", "number", false, "", "", false, "", "1"],
      ]},
      { title: "Leadership", subtitle: "Confirm your current leadership.", fields: [
        ["Leader's full name", "leader-name", "text", true],
        ["Leader's NIN", "leader-nin", "text", true],
        ["Leader's address", "leader-address", "text", true],
        ["Leader's social media link", "leader-social-media", "url"],
        ["Additional leader 1 full name", "leader-2-name"],
        ["Additional leader 1 NIN", "leader-2-nin"],
        ["Additional leader 1 address", "leader-2-address"],
        ["Additional leader 1 social media", "leader-2-social-media", "url"],
        ["Additional leader 2 full name", "leader-3-name"],
        ["Additional leader 2 NIN", "leader-3-nin"],
        ["Additional leader 2 address", "leader-3-address"],
        ["Additional leader 2 social media", "leader-3-social-media", "url"],
      ]},
      { title: "Contact and updates", subtitle: "Provide current contact details and explain your request.", fields: [
        ["Office address 1", "office-address-1", "text", true],
        ["Office address 2", "office-address-2"],
        ["Contact person", "contact", "text", true],
        ["Phone number", "phone", "tel", true],
        ["Alternative phone number", "alt-phone", "tel"],
        ["Email address", "email", "email", true],
        ["Website address", "website", "url"],
        ["Social media link", "social-media", "url"],
        ["Reason for revalidation / update", "details", "textarea"],
      ]},
      { title: "Revalidation documents", subtitle: "Upload your cooperative records.", fields: [
        ["Cooperative logo", "logo", "file", true, "", "image/jpeg,image/png,image/svg+xml", false, "JPG, PNG or SVG; maximum 5 MB."],
        ["Revalidation documents", "supporting-documents", "file", true, "", "application/pdf,image/jpeg,image/png", true, "Select all required supporting files."],
      ]},
    ],
  },
  {
    id: "partner", name: "Partner Member", fee: "₦200,000",
    description: "For agribusinesses and agricultural service providers.",
    icon: Handshake,
    downloads: ["/forms/partner-registration-form.pdf"],
    downloadNames: ["Download partner form"],
    steps: [
      { title: "Organisation details", subtitle: "Tell us about your business.", fields: [
        ["Organisation name", "org", "text", true],
        ["Type of organisation", "org-type", "text", true, "Processor, supplier, logistics..."],
        ["Business location", "location", "text", false, "State / city"],
        ["Business registration number", "business-reg-number"],
        ["Website address", "website", "url"],
        ["Social media link", "social-media", "url"],
      ]},
      { title: "Contacts", subtitle: "Provide your business contact details.", fields: [
        ["Contact person 1 full name", "contact-person-1-name", "text", true],
        ["Contact person 1 phone", "contact-person-1-phone", "tel", true],
        ["Contact person 1 relationship", "contact-person-1-relationship"],
        ["Contact person 2 full name", "contact-person-2-name"],
        ["Contact person 2 phone", "contact-person-2-phone", "tel"],
        ["Contact person 2 relationship", "contact-person-2-relationship"],
        ["Alternative phone number", "alt-phone", "tel"],
        ["Email address", "email", "email", true],
      ]},
      { title: "Partnership interests", subtitle: "Describe how we can work together.", fields: [
        ["Nature of partnership", "details", "textarea"],
      ]},
      { title: "Company documents", subtitle: "Upload your organisation's documents.", fields: [
        ["Organisation logo", "logo", "file", true, "", "image/jpeg,image/png,image/svg+xml"],
        ["Company documents", "company-documents", "file", true, "", "application/pdf,image/jpeg,image/png", true],
      ]},
    ],
  },
  {
    id: "investor", name: "Investor Member", fee: "₦500,000+",
    description: "For individuals and organisations exploring agricultural investments.",
    icon: Building2,
    downloads: [],
    downloadNames: [],
    steps: [
      { title: "Investor profile", subtitle: "Tell us who is investing.", fields: [
        ["Investor or organisation name", "org", "text", true],
        ["Investor type", "investor-type", "select", true, ["Individual investor", "Company", "Investment fund", "Development organisation", "Other institution"]],
        ["Contact person full name", "contact-name", "text", true],
        ["Phone number", "phone", "tel", true],
        ["Email address", "email", "email", true],
        ["Country and city", "location", "text", true, "e.g. Nigeria, Lagos"],
      ]},
      { title: "Investment plans", subtitle: "Help us understand your investment goals.", fields: [
        ["Preferred investment area", "investment-area", "text", true, "Farming, processing, logistics..."],
        ["Expected investment amount (NGN)", "investment-amount", "number", true, "", "", false, "", "500000", "100000"],
        ["Source of funds", "funds-source", "text", true],
        ["Investment timeframe", "timeframe", "text", false, "e.g. 1 to 3 years"],
        ["Investment objectives", "details", "textarea", true],
        ["Website address", "website", "url"],
      ]},
      { title: "Supporting documents", subtitle: "Add documents relevant to your application.", fields: [
        ["Supporting documents", "supporting-documents", "file", false, "", "application/pdf,image/jpeg,image/png", true],
      ]},
    ],
  },
  {
    id: "sponsor", name: "Sponsor Member", fee: "Contact us",
    description: "For organisations supporting agricultural programmes and communities.",
    icon: Wallet,
    downloads: ["/forms/sponsor-registration-form.pdf"],
    downloadNames: ["Download sponsor form"],
    steps: [
      { title: "Sponsor profile", subtitle: "Tell us who is supporting the programme.", fields: [
        ["Organisation / individual name", "org", "text", true],
        ["Sponsor category", "category", "text", true, "Corporate, NGO, donor..."],
        ["Email address", "email", "email", true],
        ["Alternative phone number", "alt-phone", "tel"],
        ["Website address", "website", "url"],
        ["Social media link", "social-media", "url"],
      ]},
      { title: "Contact persons", subtitle: "Provide your sponsor contacts.", fields: [
        ["Contact person 1 full name", "contact-person-1-name", "text", true],
        ["Contact person 1 phone", "contact-person-1-phone", "tel", true],
        ["Contact person 1 relationship", "contact-person-1-relationship"],
        ["Contact person 2 full name", "contact-person-2-name"],
        ["Contact person 2 phone", "contact-person-2-phone", "tel"],
        ["Contact person 2 relationship", "contact-person-2-relationship"],
      ]},
      { title: "Sponsorship interests", subtitle: "Tell us how you would like to contribute.", fields: [
        ["Preferred support area", "support-area", "text", false, "Training, machinery, inputs..."],
        ["Funding interest level", "funding-level"],
        ["Details of sponsorship interest", "details", "textarea"],
      ]},
      { title: "Supporting documents", subtitle: "Upload your organisation's supporting files.", fields: [
        ["Organisation logo", "logo", "file", true, "", "image/jpeg,image/png,image/svg+xml"],
        ["Supporting documents", "supporting-documents", "file", true, "", "application/pdf,image/jpeg,image/png", true],
      ]},
    ],
  },
];

const benefits = [
  "Access to state coordinators and agricultural networks.",
  "Training, advisory and value-addition support.",
  "Connections to financing and agency banking services.",
  "Discounted access to machinery, seedlings and inputs.",
  "Digital tools for farm management and market information.",
  "Support connecting produce with wider markets.",
];

function Field({ config, value, onChange }) {
  const [label, name, type = "text", required = false, extra, accept, multiple, hint, min, step] = config;
  const options = type === "select" ? extra : null;
  const placeholder = type !== "select" && type !== "file" ? extra : undefined;
  const fileNames = value && type === "file"
    ? Array.from(value).map(file => file.name).join(", ")
    : "";

  const common = {
    name,
    required,
    className: "mt-2 w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#267653] focus:ring-4 focus:ring-[#267653]/10",
    onChange: event => onChange(name, type === "file" ? event.target.files : event.target.value),
    ...(type === "number" && min ? { min } : {}),
    ...(type === "number" && step ? { step } : {}),
  };

  return (
    <label className="block min-w-0 text-sm font-medium text-gray-700">
      {label}
      {required && <span className="ml-1 text-red-600">*</span>}
      {hint && <span className="mt-1 block text-xs font-normal leading-relaxed text-gray-500">{hint}</span>}
      {options ? (
        <select {...common} value={value || ""}>
          <option value="">Select an option</option>
          {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea {...common} rows={4} placeholder={placeholder} value={value || ""} />
      ) : type === "file" ? (
        <span className="mt-2 flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 transition hover:border-[#267653]">
          <Upload size={20} className="shrink-0 text-[#267653]" />
          <span className="min-w-0 flex-1 break-words text-sm text-gray-600">
            {fileNames || `Choose file${multiple ? "(s)" : ""}`}
          </span>
          <input {...common} type="file" accept={accept} multiple={multiple} className="sr-only" />
        </span>
      ) : (
        <input {...common} type={type} placeholder={placeholder} value={value || ""} />
      )}
    </label>
  );
}

function Progress({ current, total }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3 text-xs font-medium text-gray-500">
        <span>Step {current + 1} of {total}</span>
        <span>{Math.round(((current + 1) / total) * 100)}% complete</span>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: total }, (_, index) => (
          <div key={index} className={`h-1.5 flex-1 rounded-full transition-colors ${index <= current ? "bg-[#267653]" : "bg-gray-200"}`} />
        ))}
      </div>
    </div>
  );
}

function RegistrationWizard({ category, onClose }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({});
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const review = step === category.steps.length;
  const activeStep = category.steps[step];

  function updateValue(name, value) {
    setValues(previous => ({ ...previous, [name]: value }));
    setError("");
  }


function validateCurrentStep() {
  const controls = Array.from(
    formRef.current.querySelectorAll(
      "input, select, textarea"
    )
  ).filter((control) => {
    return (
      control.closest("[data-step-field]") &&
      !control.disabled
    );
  });

  for (const control of controls) {
    if (!control.checkValidity()) {
      control.reportValidity();
      return false;
    }

    if (control.type === "file" && control.files?.length) {
      let maxSize = Infinity;

      if (control.name === "passport-photo" || control.name === "logo") {
        maxSize = 5 * 1024 * 1024;
      } else if (control.name === "identity-document") {
        maxSize = 10 * 1024 * 1024;
      }

      for (const file of control.files) {
        if (file.size > maxSize) {
          setError(
            `${file.name} exceeds the allowed ${
              maxSize / 1024 / 1024
            } MB file size.`
          );
          return false;
        }
      }
    }
  }

  setError("");
  return true;
}


  function nextStep(event) {
    event.preventDefault();
    if (!validateCurrentStep()) return;
    setError("");
    setStep(current => current + 1);
  }

  function submitApplication(event) {
    event.preventDefault();

    if (category.id === "sponsor") {
      setSubmitted(true);
      setError("Sponsor applications require a discussion with our team. Please use the contact link below to arrange sponsorship.");
      return;
    }

    setError("Your details have not been sent or saved yet. Connect this form to your existing Agro Trade Hub backend and Paystack registration endpoint before accepting applications.");
  }

  const icons = [UserRound, MapPin, BriefcaseBusiness, Upload, ClipboardCheck];
  const StepIcon = review ? ClipboardCheck : icons[step] || FileText;

  return (
    <section id="registration-form" className="scroll-mt-24 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-900/5">
      <header className="flex items-start justify-between gap-4 bg-[#0d3025] p-5 text-white sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d7e7a5]">Membership application</p>
          <h3 className="mt-2 text-xl font-semibold sm:text-2xl">{category.name}</h3>
          <p className="mt-2 text-sm text-white/70">Registration fee: {category.fee}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close form" className="rounded-full border border-white/20 p-2 hover:bg-white/10">
          <X size={19} />
        </button>
      </header>

      <form ref={formRef} noValidate onSubmit={review ? submitApplication : nextStep} className="p-5 sm:p-8">
        <Progress current={step} total={category.steps.length + 1} />

        <div className="mt-7 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf4e5] text-[#267653]">
            <StepIcon size={21} />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#17372b]">
              {review ? "Review your application" : activeStep.title}
            </h4>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              {review ? "Check your details before proceeding." : activeStep.subtitle}
            </p>
          </div>
        </div>

        {!review ? (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {activeStep.fields.map(config => (
              <div key={config[1]} className={config[2] === "textarea" || config[2] === "file" ? "sm:col-span-2" : ""} data-step-field>
                <Field config={config} value={values[config[1]]} onChange={updateValue} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-7 space-y-5">
            {category.steps.map(section => (
              <div key={section.title} className="rounded-2xl border border-gray-200 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h5 className="font-semibold text-[#17372b]">{section.title}</h5>
                  <button type="button" onClick={() => setStep(category.steps.indexOf(section))} className="text-sm font-semibold text-[#267653] hover:underline">Edit</button>
                </div>
                <div className="mt-4 divide-y divide-gray-100">
                  {section.fields.map(config => {
                    const [, name, type] = config;
                    const value = values[name];
                    const display = type === "file" && value
                      ? Array.from(value).map(file => file.name).join(", ")
                      : value || "Not provided";
                    return (
                      <div key={name} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:gap-5">
                        <span className="text-sm text-gray-500">{config[0]}</span>
                        <span className="break-words text-sm font-medium text-gray-800 sm:max-w-[60%] sm:text-right">{display}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="rounded-2xl bg-[#f5f7f0] p-4">
              <p className="font-semibold text-[#17372b]">Registration fee</p>
              <p className="mt-1 text-xl font-semibold">{category.fee}</p>
              <p className="mt-2 text-xs leading-5 text-gray-500">Review the applicable payment and refund terms before paying.</p>
            </div>
          </div>
        )}

        {error && (
          <div role="status" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            {error}
            {category.id === "sponsor" && (
              <a className="mt-2 block font-semibold underline" href="mailto:agrotradehubs@gmail.com?subject=Sponsorship%20enquiry">Contact Agro Trade Hub</a>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={() => step === 0 ? onClose() : (setStep(current => current - 1), setError(""))} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <ArrowLeft size={17} /> {step === 0 ? "Cancel" : "Previous"}
          </button>
          <div className="flex flex-col gap-3 sm:flex-row">
            {category.downloads.map((url, index) => (
              <a key={url} href={url} download className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <FileText size={17} /> {category.downloadNames[index]}
              </a>
            ))}
            <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#176b45] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#105438]">
              {review ? (category.id === "sponsor" ? "Contact our team" : "Proceed to Pay") : "Save and continue"}
              {review ? <Check size={17} /> : <ArrowRight size={17} />}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default function Membership() {
  const [activeCategory, setActiveCategory] = useState(null);
  const selected = categories.find(category => category.id === activeCategory);

  function chooseCategory(id) {
    setActiveCategory(id);
    requestAnimationFrame(() => {
      document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-white text-[#17372b]">
      <section className="relative overflow-hidden bg-[#0c3025]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#a5c86c]/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.2fr_.8fr] lg:gap-16 lg:px-12 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[.17em] text-[#d9e8a9]">
              <Sprout size={15} /> Membership
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">Membership built for how you work the land.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">Join a network connecting farmers, cooperatives, agribusinesses and investors with practical support and agricultural opportunities.</p>
            <a href="#membership-options" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#dce9ae] px-6 py-3 text-sm font-semibold text-[#163a2a] hover:bg-white">Explore membership <ArrowRight size={18} /></a>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[.06] p-6 sm:p-8">
            <p className="text-sm text-white/60">Grow with a stronger network</p>
            {[
              [Sprout, "Farmers", "Practical support for individual growers and smallholders."],
              [Users, "Cooperatives", "Stronger connections for organised farmer groups."],
              [Handshake, "Partners and investors", "Opportunities across the agricultural value chain."],
            ].map(([Icon, title, description]) => (
              <div key={title} className="mt-6 flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#dce9ae]/10 text-[#dce9ae]"><Icon size={21} /></div>
                <div><h2 className="font-semibold text-white">{title}</h2><p className="mt-1 text-sm leading-6 text-white/60">{description}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#39815a]">Find your place</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Who can join Agro Trade Hub?</h2>
          <p className="mt-4 max-w-2xl leading-7 text-gray-600">We bring people across the agricultural value chain together to improve access to resources, knowledge, markets and opportunities.</p>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [Sprout, "Farmers", "Smallholders and commercial growers of rice, maize, yam, plantain, cassava, cocoa and other crops."],
              [Users, "Cooperatives", "Registered societies and farmer groups coordinating on behalf of their members."],
              [Building2, "Agribusinesses", "Processors, input suppliers, logistics providers and commercial partners."],
            ].map(([Icon, title, description]) => (
              <article key={title} className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:border-[#b5cdb7] hover:shadow-lg sm:p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf4e5] text-[#267653]"><Icon size={23} /></div>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f7f0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#39815a]">Your membership</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">More than a membership card.</h2><p className="mt-4 max-w-xl leading-7 text-gray-600">Become part of a network designed to connect agricultural communities with practical support and new opportunities.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map(benefit => <div key={benefit} className="flex items-start gap-3 rounded-2xl border border-gray-200/80 bg-white p-4"><CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#39815a]" /><p className="text-sm leading-6 text-gray-700">{benefit}</p></div>)}
          </div>
        </div>
      </section>

      <section id="membership-options" className="scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#39815a]">Choose your pathway</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Membership categories</h2><p className="mt-4 leading-7 text-gray-600">Choose the category that best describes you or your organisation to view its application steps.</p></div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ id, name, description, fee, icon: Icon, steps }, index) => (
              <article key={id} className={`flex flex-col rounded-3xl border p-6 sm:p-7 ${index === 3 ? "border-[#276e4a] bg-[#10382a] text-white" : "border-gray-200 bg-white"}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${index === 3 ? "bg-white/10 text-[#dce9ae]" : "bg-[#edf4e5] text-[#267653]"}`}><Icon size={23} /></div>
                <h3 className="mt-5 text-xl font-semibold">{name}</h3>
                <p className={`mt-3 flex-1 text-sm leading-7 ${index === 3 ? "text-white/70" : "text-gray-600"}`}>{description}</p>
                <div className={`mt-6 border-t pt-5 ${index === 3 ? "border-white/15" : "border-gray-100"}`}><p className="text-xs uppercase tracking-wider opacity-60">Registration fee</p><p className="mt-1 text-2xl font-semibold">{fee}</p><p className="mt-2 text-xs opacity-60">{steps.length + 1} short steps, including review</p></div>
                <button type="button" onClick={() => chooseCategory(id)} className={`mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${index === 3 ? "bg-[#dce9ae] text-[#17372b] hover:bg-white" : "bg-[#176b45] text-white hover:bg-[#105438]"}`}>Apply now <ArrowRight size={17} /></button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-gray-200">
          <div className="flex items-center gap-3 bg-[#0d3025] p-6 text-white sm:p-8"><Wallet className="text-[#dce9ae]" size={24} /><div><h2 className="text-xl font-semibold sm:text-2xl">Registration fees</h2><p className="mt-1 text-sm text-white/60">Published registration fee schedule</p></div></div>
          {[
            ["Farmer membership", "₦3,000"],
            ["New cooperative / group registration", "₦50,000"],
            ["Cooperative revalidation", "₦25,000"],
            ["Partner membership", "₦200,000"],
            ["Investor membership", "₦500,000 – ₦10,000,000+"],
            ["Sponsor membership", "Contact us"],
          ].map(([label, amount]) => <div key={label} className="flex flex-col gap-1 border-b border-gray-100 px-5 py-4 last:border-0 sm:flex-row sm:justify-between sm:gap-4 sm:px-8"><span className="text-sm text-gray-600">{label}</span><span className="font-semibold">{amount}</span></div>)}
        </div>
      </section>

      <section id="register" className="scroll-mt-20 bg-[#f5f7f0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#39815a]">Take the next step</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Start your membership application.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-gray-600">Select a membership type. We'll guide you through the form one short section at a time.</p>

          <div className="mt-7 rounded-2xl border border-[#dce6c9] bg-white p-5 sm:p-6">
            <div className="flex items-start gap-3"><ShieldCheck size={22} className="mt-0.5 shrink-0 text-[#267653]" /><div><h3 className="font-semibold">Before you register</h3><p className="mt-2 text-sm leading-7 text-gray-600">Have your information and supporting documents ready. Paid registrations must be connected to the existing backend and Paystack before applications can be submitted.</p><a href="mailto:agrotradehubs@gmail.com?subject=Membership%20payment%20and%20refund%20policy" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#267653] hover:underline">Request the payment and refund policy <ArrowRight size={15} /></a></div></div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ id, name, fee, icon: Icon }) => (
              <button type="button" key={id} onClick={() => chooseCategory(id)} aria-pressed={activeCategory === id} className={`flex min-w-0 items-center justify-between gap-3 rounded-2xl border bg-white p-4 text-left transition sm:p-5 ${activeCategory === id ? "border-[#267653] ring-2 ring-[#267653]/15" : "border-gray-200 hover:border-[#9dbca4]"}`}>
                <span className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4e5] text-[#267653]"><Icon size={20} /></span><span className="min-w-0"><span className="block text-sm font-semibold">{name}</span><span className="mt-1 block text-xs text-gray-500">{fee}</span></span></span>
                <ArrowRight size={18} className="shrink-0 text-gray-400" />
              </button>
            ))}
          </div>

          {selected && <div className="mt-8"><RegistrationWizard key={selected.id} category={selected} onClose={() => setActiveCategory(null)} /></div>}
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-6 sm:p-9 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf4e5] text-[#267653]"><Users size={24} /></div><div><h2 className="text-2xl font-semibold">Our members</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-gray-600">Meet the Agro Trade Hub community and discover people and organisations working together across agriculture.</p></div></div>
          <a href="mailto:agrotradehubs@gmail.com?subject=Agro%20Trade%20Hub%20Membership" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#176b45] px-6 py-3 text-sm font-semibold text-white hover:bg-[#105438]">Contact our team <ArrowRight size={17} /></a>
        </div>
      </section>
    </main>
  );
}
