import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { demoTabs } from '../data';

export function DemoPreviewSection() {
  const [activeTab, setActiveTab] = useState(demoTabs[0].id);
  const currentTab = demoTabs.find(tab => tab.id === activeTab) || demoTabs[0];

  return (
    <section id="demo" className="py-20 bg-theme-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
            Explora la Plataforma
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Descubre todas las funcionalidades de DerechGo
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {demoTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent text-theme-primary'
                    : 'bg-theme-secondary/50 text-theme-secondary hover:bg-theme'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-theme-secondary rounded-2xl p-8 md:p-12 text-theme-primary"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{currentTab.title}</h3>
                <p className="text-theme-secondary text-lg mb-6">{currentTab.description}</p>
                <ul className="space-y-3">
                  {currentTab.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-theme-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-theme-tertiary rounded-xl h-64 md:h-80 flex items-center justify-center border border-theme">
                <div className="text-center">
                  <currentTab.icon className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                  <p className="text-theme-tertiary">Vista previa de {currentTab.label}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
