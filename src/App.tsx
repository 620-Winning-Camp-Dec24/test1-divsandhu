import React, { useState } from 'react';
import { Heart, Users, DollarSign, ArrowRightLeft } from 'lucide-react';
import DonorDashboard from './components/DonorDashboard';
import RecipientDashboard from './components/RecipientDashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  const [userType, setUserType] = useState<'donor' | 'recipient' | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6" />
            <h1 className="text-xl font-bold">DisasterRelief Connect</h1>
          </div>
          {userType && (
            <button
              onClick={() => setUserType(null)}
              className="text-sm bg-white/10 px-4 py-2 rounded-md hover:bg-white/20 transition-colors"
            >
              Switch User Type
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-6">
        {!userType ? (
          <div className="max-w-2xl mx-auto mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Welcome to DisasterRelief Connect</h2>
              <p className="text-gray-600">A decentralized platform connecting donors with disaster relief initiatives</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setUserType('donor')}
                className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 flex flex-col items-center gap-4 group"
              >
                <div className="p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">I'm a Donor</h3>
                  <p className="text-gray-600">Support relief efforts with secure blockchain donations</p>
                </div>
              </button>

              <button
                onClick={() => setUserType('recipient')}
                className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 flex flex-col items-center gap-4 group"
              >
                <div className="p-4 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">I'm a Recipient</h3>
                  <p className="text-gray-600">Request and manage disaster relief funds</p>
                </div>
              </button>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500">
                Powered by Ethereum blockchain technology for transparent and secure transactions
              </p>
            </div>
          </div>
        ) : (
          <>
            {userType === 'donor' ? <DonorDashboard /> : <RecipientDashboard />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;