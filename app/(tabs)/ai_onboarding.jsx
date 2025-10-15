import { useState } from "react";

const AIOnboarding = () => {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <div>
      <h1>AI Onboarding</h1>
      {step === 0 && <p>What’s a typical day like for you?</p>}
      {step === 1 && (
        <p>
          Thanks for sharing! Just to make sure I got it right. you work 8
          hours, lift heavy things sometimes, have some mid- and lower-back
          pain. Is that right?
        </p>
      )}
      {step === 2 && (
        <p>
          Thanks! I’ve got your daily routine, but what does your schedule look
          like? I can set up a plan and we can adjust it together.
        </p>
      )}
      {step === 3 && (
        <p>
          Great! I’ll set up a plan for you. You can always adjust it later.
        </p>
      )}
      {step === 1 ? (
        <button onClick={nextStep}>Yes</button>
      ) : (
        <>
          <button onClick={nextStep}>Yes</button>
          <input type="text" placeholder="No, I actually..." />
          <button onClick={nextStep}>Send Button</button>
        </>
      )}
    </div>
  );
};

export default AIOnboarding;
