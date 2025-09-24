
import { FiAlertTriangle, FiExternalLink } from "react-icons/fi";

const NewsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">TERMS AND CONDITIONS</h1>
        <p className="text-gray-600">Please read these terms carefully before using our services</p>
      </div>

      {/* Card Checker Banner */}
      <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiAlertTriangle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Use our card checker to verify if cards are live. If not, replacement will be provided within 15 minutes.{" "}
              <a 
                href="https://luxchecker.pw" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-700 hover:text-blue-600 inline-flex items-center"
              >
                Visit LuxChecker <FiExternalLink className="ml-1" />
              </a>
            </p>
          </div>
        </div>
      </div>
  
      {/* Terms Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <ol className="list-decimal pl-5 space-y-4 text-gray-700">
          <li className="font-medium">By registering and using the shop & services, you indicate that you have read and accept these Terms and agree to abide by and be bound by all such Terms.</li>
          <li>We only sell cvv2 cards</li>
          <li>Any customer is able to reach customer service by submitting a ticket.</li>
          <li>As a long time player with vast reputation and rating on all carding communities we are not providing any free tests.</li>
          <li>Account balance in shop can only be spent, there is no money back, only refunds of current purchases. Competently plan how much money you are willing to spend.</li>
          <li>Creating clone-accounts, attempting to hack, cheat or abuse the shop will lead to an immediate ban.</li>
          <li>Refundable and Non-refundable purchases is indicated in the market place Yes/No.</li>
          <li className="font-semibold text-red-600">WE ARE NOT RESPONSIBLE FOR WRONG AVS AND CARD BALANCE.</li>
          <li>Please save all cards on your own Hard Disk - we periodically delete old bases.</li>
          <li className="font-medium">Default replacement time is 15 minutes</li>
        </ol>

        {/* Card Checker Section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Card Verification</h3>
          <p className="text-gray-700 mb-3">
            Always check your cards using our recommended checker. If the card is not live, you'll receive a replacement within 15 minutes.
          </p>
          <a 
            href="https://luxchecker.pw" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to LuxChecker <FiExternalLink className="ml-2" />
          </a>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default NewsPage;