import React from "react";
import Button from "./Button";
import Link from "next/link";

const Step0: React.FC<{ nextStep: () => void; step: number }> = ({ nextStep }) => {
  return (
    <div className="flex flex-col gap-4">
      <ul className="list-disc pl-4 text-sm">
        <li>
          <p>
            <Button
              as={Link}
              href="https://chrome.google.com/webstore/detail/vectis/cgkaddoglojnmfiblgmlinfaijcdpfjm"
              target="_blank"
              variant="link"
              className="!text-sm"
            >
              Download the Vectis Extension
            </Button>{" "}
            from the Chrome Web Store.
          </p>
        </li>

        <li>
          <p>
            <Button as={Link} href="https://testnet-app.vectis.space/" variant="link" target="_blank" className="!text-sm">
              Create a Vectis account
            </Button>{" "}
            in the dashboard.
          </p>
        </li>

        <li>
          <p>
            <Button as={Link} href="https://testnet-app.vectis.space/" variant="link" target="_blank" className="!text-sm">
              Install the Cronkitty plugin
            </Button>
            .
          </p>
        </li>

        <li>
          <p>Select your Vectis account in the Vectis Extension and connect your wallet.</p>
        </li>
      </ul>
      <p className="text-xs text-gray-300">Don`t worry if these steps seems complicate, we will guide you in this process.</p>
      <Button onClick={nextStep}>Start journey</Button>
    </div>
  );
};

export default Step0;
