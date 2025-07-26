// app/signup/page.tsx

import SignUpPage from '@/components/SignUpPage';

export default function Page() {
  // This div is the key. 
  // It becomes a flex container that fills all available vertical space (h-full)
  // and then centers its child (the SignUpPage component) in every direction.
  return (
    <div>
      <SignUpPage />
    </div>
  );
}