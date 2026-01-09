import React, { useState } from 'react'
import { FlashcardsResponse, NotesResponse, QuizResponse, StudyMode } from '../../../types'
import FlashcardDisplay from '../../Display/FlashcardDisplay'
import NotesDisplay from '../../Display/NotesDisplay'
import QuizDisplay from '../../Display/QuizDisplay'
import { Zap, BookOpen, Brain, FileText } from 'lucide-react'
import LatexRenderer from '../../Display/LatexRenderer'

// Real CBSE 12th Physics content
const flashcardsData: FlashcardsResponse = {
  cards: [
    {
      question: "What is Coulomb's Law?",
      answer: "The force between two point charges is directly proportional to the product of charges and inversely proportional to the square of distance between them. Mathematically: $$F = k\\frac{q_1 q_2}{r^2}$$ where $k = 9 \\times 10^9 \\text{ N⋅m}^2/\\text{C}^2$"
    },
    {
      question: "Define Electric Field and its SI unit",
      answer: "Electric field at a point is the force experienced by a unit positive charge placed at that point. $$\\vec{E} = \\frac{\\vec{F}}{q_0}$$ SI Unit: N/C or V/m. Direction: Away from positive charge, towards negative charge."
    },
    {
      question: "What is Electric Potential?",
      answer: "Work done in bringing a unit positive charge from infinity to that point against electric field. $$V = \\frac{W}{q} = \\frac{kq}{r}$$ SI Unit: Volt (V). It is a scalar quantity."
    },
    {
      question: "State Gauss's Law",
      answer: "The total electric flux through a closed surface is equal to $\\frac{1}{\\epsilon_0}$ times the net charge enclosed. $$\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{enc}}{\\epsilon_0}$$ where $\\epsilon_0 = 8.85 \\times 10^{-12} \\text{ C}^2/\\text{N⋅m}^2$"
    },
    {
      question: "What is Capacitance?",
      answer: "Ability of a conductor to store charge. For a capacitor: $$C = \\frac{Q}{V}$$ SI Unit: Farad (F). For parallel plate capacitor: $$C = \\frac{\\epsilon_0 A}{d}$$"
    },
    {
      question: "Define Electric Current",
      answer: "Rate of flow of electric charge. $$I = \\frac{dQ}{dt}$$ SI Unit: Ampere (A). 1 Ampere = 1 Coulomb/second. Direction: Flow of positive charges (opposite to electron flow)."
    },
    {
      question: "State Ohm's Law",
      answer: "Current through a conductor is directly proportional to potential difference across it (at constant temperature). $$V = IR$$ where R is resistance. SI Unit of R: Ohm (Ω)"
    },
    {
      question: "What is Resistivity?",
      answer: "Property of material that opposes current flow. $$R = \\rho \\frac{l}{A}$$ where $\\rho$ is resistivity, $l$ is length, $A$ is area. SI Unit: Ω⋅m. Depends on temperature: $\\rho(T) = \\rho_0(1 + \\alpha \\Delta T)$"
    },
    {
      question: "Kirchhoff's Current Law (KCL)",
      answer: "Sum of currents entering a junction equals sum of currents leaving. $$\\sum I_{in} = \\sum I_{out}$$ Based on conservation of charge."
    },
    {
      question: "Kirchhoff's Voltage Law (KVL)",
      answer: "Sum of all potential differences around a closed loop is zero. $$\\sum V = 0$$ Based on conservation of energy."
    },
    {
      question: "Energy stored in a Capacitor",
      answer: "$$U = \\frac{1}{2}CV^2 = \\frac{1}{2}QV = \\frac{Q^2}{2C}$$ Energy density in electric field: $$u = \\frac{1}{2}\\epsilon_0 E^2$$"
    },
    {
      question: "Drift Velocity formula",
      answer: "Average velocity of electrons in conductor. $$v_d = \\frac{I}{neA}$$ where $n$ is electron density, $e$ is electron charge, $A$ is area. Related to current: $$I = neAv_d$$"
    }
  ],
  title: "Electrostatics & Current - Quick Revision",
  theme: undefined
}

const notesData: NotesResponse = {
  mode: 'notes',
  title: "Electrostatics & Current Electricity",
  sections: [
    {
      heading: "1. Electrostatics - Fundamental Concepts",
      bullets: [
        "**Electric Charge:** Two types - Positive and Negative. Like charges repel, unlike charges attract",
        "**Quantization:** $q = ne$ where $n$ is integer, $e = 1.6 \\times 10^{-19}$ C",
        "**Conservation:** Total charge in isolated system remains constant",
        "**Coulomb's Law:** $F = k\\frac{|q_1 q_2|}{r^2}$ where $k = 9 \\times 10^9$ N⋅m²/C²",
        "In medium: $F = \\frac{1}{4\\pi\\epsilon_0\\epsilon_r}\\frac{|q_1 q_2|}{r^2}$",
        "Vector form: $\\vec{F}_{12} = k\\frac{q_1 q_2}{r^2}\\hat{r}_{12}$",
        "**Electric Field:** $\\vec{E} = \\frac{\\vec{F}}{q_0}$ (SI Unit: N/C or V/m)",
        "Due to point charge: $E = k\\frac{q}{r^2}$",
        "Superposition principle applies for multiple charges",
        "Field lines start from positive charge and end on negative charge"
      ]
    },
    {
      heading: "2. Electric Potential and Capacitance",
      bullets: [
        "**Electric Potential:** Work done per unit charge, $V = \\frac{W}{q}$ (SI Unit: Volt)",
        "Due to point charge: $V = k\\frac{q}{r}$",
        "Potential difference: $V_{AB} = V_A - V_B = -\\int_A^B \\vec{E}\\cdot d\\vec{l}$",
        "Relation with field: $E = -\\frac{dV}{dr}$",
        "**Equipotential Surfaces:** No work done in moving charge along surface, always perpendicular to field lines",
        "**Parallel Plate Capacitor:** $C = \\frac{\\epsilon_0 A}{d}$",
        "With dielectric: $C' = KC$ where K is dielectric constant",
        "**Series combination:** $\\frac{1}{C_s} = \\frac{1}{C_1} + \\frac{1}{C_2} + ...$",
        "**Parallel combination:** $C_p = C_1 + C_2 + ...$",
        "**Energy stored:** $U = \\frac{1}{2}CV^2 = \\frac{1}{2}QV = \\frac{Q^2}{2C}$"
      ]
    },
    {
      heading: "3. Gauss's Law and Applications",
      bullets: [
        "**Gauss's Law:** $\\oint \\vec{E}\\cdot d\\vec{A} = \\frac{Q_{enc}}{\\epsilon_0}$",
        "Electric flux through closed surface = charge enclosed / $\\epsilon_0$",
        "**Infinite line charge:** $E = \\frac{\\lambda}{2\\pi\\epsilon_0 r}$ (radial direction)",
        "**Infinite plane sheet:** $E = \\frac{\\sigma}{2\\epsilon_0}$ (independent of distance)",
        "**Spherical shell - Inside:** $E = 0$ (no charge enclosed)",
        "**Spherical shell - Outside:** $E = k\\frac{Q}{r^2}$ (behaves as point charge at center)",
        "**Spherical shell - Surface:** $E = \\frac{\\sigma}{\\epsilon_0}$",
        "**Solid sphere - Inside:** $E = \\frac{kQr}{R^3}$ (proportional to distance)",
        "**Solid sphere - Outside:** $E = k\\frac{Q}{r^2}$ (same as point charge)"
      ]
    },
    {
      heading: "4. Current Electricity - Basic Concepts",
      bullets: [
        "**Electric Current:** Rate of flow of charge, $I = \\frac{dQ}{dt}$ (SI Unit: Ampere, 1 A = 1 C/s)",
        "**Drift velocity:** $v_d = \\frac{eE\\tau}{m}$ where $\\tau$ is relaxation time",
        "**Current density:** $\\vec{J} = \\frac{I}{A} = ne\\vec{v_d}$",
        "**Ohm's Law:** $V = IR$ (valid for ohmic conductors at constant temperature)",
        "**Resistance:** $R = \\rho\\frac{l}{A}$ where $\\rho$ is resistivity",
        "**Conductivity:** $\\sigma = \\frac{1}{\\rho}$",
        "**Temperature dependence:** $\\rho_T = \\rho_0(1 + \\alpha\\Delta T)$",
        "For metals: $\\alpha$ is positive; For semiconductors: $\\alpha$ is negative",
        "**Power:** $P = VI = I^2R = \\frac{V^2}{R}$ (SI Unit: Watt)",
        "**Heat produced:** $H = I^2Rt$ (Joule)"
      ]
    },
    {
      heading: "5. Kirchhoff's Laws and Circuit Analysis",
      bullets: [
        "**Kirchhoff's Current Law (KCL):** $\\sum I_{in} = \\sum I_{out}$ at any junction (based on charge conservation)",
        "**Kirchhoff's Voltage Law (KVL):** $\\sum V = 0$ around any closed loop (based on energy conservation)",
        "**Series resistors:** $R_s = R_1 + R_2 + R_3 + ...$ (same current, voltages add)",
        "**Parallel resistors:** $\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + ...$ (same voltage, currents add)",
        "**Wheatstone Bridge (balanced):** $\\frac{P}{Q} = \\frac{R}{S}$ (no current through galvanometer)",
        "**Cells in series:** $V_{total} = V_1 + V_2 + ...$, $r_{total} = r_1 + r_2 + ...$",
        "**Identical cells in parallel:** $V = V_1$, $r_{eq} = \\frac{r}{n}$",
        "**EMF:** Total voltage of cell, **Terminal voltage:** $V = E - Ir$ where r is internal resistance"
      ]
    },
    {
      heading: "6. Important Constants and Quick Formulas",
      bullets: [
        "**Coulomb's constant:** $k = 9 \\times 10^9$ N⋅m²/C²",
        "**Permittivity of free space:** $\\epsilon_0 = 8.85 \\times 10^{-12}$ C²/N⋅m²",
        "**Elementary charge:** $e = 1.6 \\times 10^{-19}$ C",
        "**Permeability:** $\\mu_0 = 4\\pi \\times 10^{-7}$ H/m",
        "Electric force: $F = k\\frac{q_1q_2}{r^2}$ | Electric field: $E = k\\frac{q}{r^2}$ | Potential: $V = k\\frac{q}{r}$",
        "Capacitance: $C = \\frac{Q}{V}$ | Current: $I = \\frac{Q}{t}$ | Ohm's law: $V = IR$",
        "Power: $P = VI = I^2R = \\frac{V^2}{R}$ | Drift velocity relation: $I = neAv_d$",
        "Mobility: $\\mu = \\frac{v_d}{E} = \\frac{e\\tau}{m}$ | Energy in capacitor: $U = \\frac{1}{2}CV^2$"
      ]
    }
  ]
}

const quizData: QuizResponse = {
  mode: 'quiz',
  mcq: [
    {
      q: "Two point charges $+3\\mu C$ and $-3\\mu C$ are placed 20 cm apart. What is the electric field at the midpoint?",
      options: [
        "$2.7 \\times 10^6$ N/C towards negative charge",
        "$5.4 \\times 10^6$ N/C towards negative charge",
        "$2.7 \\times 10^6$ N/C towards positive charge",
        "Zero"
      ],
      answer: "$5.4 \\times 10^6$ N/C towards negative charge"
    },
    {
      q: "A parallel plate capacitor has capacitance 10 μF. If the separation is doubled keeping charge constant, new potential difference will be:",
      options: [
        "Same",
        "Doubled",
        "Halved",
        "Four times"
      ],
      answer: "Doubled"
    },
    {
      q: "A wire of resistance 10Ω is stretched to twice its length. What is the new resistance?",
      options: [
        "10 Ω",
        "20 Ω",
        "40 Ω",
        "5 Ω"
      ],
      answer: "40 Ω"
    },
    {
      q: "Three resistors 2Ω, 3Ω, and 6Ω are connected in parallel. The equivalent resistance is:",
      options: [
        "11 Ω",
        "1 Ω",
        "2 Ω",
        "6 Ω"
      ],
      answer: "1 Ω"
    },
    {
      q: "The drift velocity of electrons in a conductor is typically:",
      options: [
        "$10^8$ m/s",
        "$10^6$ m/s",
        "$10^{-4}$ m/s",
        "$3 \\times 10^8$ m/s"
      ],
      answer: "$10^{-4}$ m/s"
    },
    {
      q: "A capacitor of 5μF charged to 100V is connected to another uncharged capacitor of 10μF. Common potential will be:",
      options: [
        "100 V",
        "50 V",
        "33.3 V",
        "66.7 V"
      ],
      answer: "33.3 V"
    },
    {
      q: "The electric field inside a uniformly charged spherical shell is:",
      options: [
        "Maximum at center",
        "Inversely proportional to distance from center",
        "Zero everywhere",
        "Uniform but non-zero"
      ],
      answer: "Zero everywhere"
    },
    {
      q: "A cell of emf 2V and internal resistance 0.5Ω is connected to 3.5Ω resistor. Current in circuit is:",
      options: [
        "0.5 A",
        "1 A",
        "2 A",
        "4 A"
      ],
      answer: "0.5 A"
    },
    {
      q: "Power dissipated in resistance R when current I flows through it is:",
      options: [
        "$IR$",
        "$I^2R$",
        "$IR^2$",
        "$\\sqrt{IR}$"
      ],
      answer: "$I^2R$"
    },
    {
      q: "Two wires A and B of same material have lengths in ratio 1:2 and radii in ratio 2:1. Ratio of their resistances is:",
      options: [
        "1:8",
        "8:1",
        "1:4",
        "4:1"
      ],
      answer: "1:8"
    }
  ],
  short: []
}

const Topic_12_phy_ncert: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<StudyMode>(StudyMode.NOTES)

  const renderContent = () => {
    switch (selectedMode) {
      case StudyMode.FLASHCARDS:
        return (
          <FlashcardDisplay 
            data={flashcardsData}
            canUseThemes={false}
            onOpenUpgrade={() => {}}
          />
        )
      case StudyMode.NOTES:
        return <NotesDisplay data={notesData} />
      case StudyMode.QUIZ:
        return <QuizDisplay data={quizData} />
      default:
        return <NotesDisplay data={notesData} />
    }
  }

  const modes = [
    { id: StudyMode.NOTES, icon: BookOpen, label: 'Study Notes', color: 'from-blue-500 to-cyan-500' },
    { id: StudyMode.FLASHCARDS, icon: Brain, label: 'Flashcards', color: 'from-purple-500 to-pink-500' },
    { id: StudyMode.QUIZ, icon: FileText, label: 'Practice Quiz', color: 'from-green-500 to-emerald-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-6 shadow-2xl">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Physics Class 12</h1>
          </div>
          <h2 className="text-2xl font-semibold ml-13 opacity-90">Electrostatics & Current Electricity</h2>
          <p className="mt-3 text-blue-100 ml-13">CBSE NCERT | Chapter 1 & 2</p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="container mx-auto max-w-5xl px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {modes.map((mode) => {
            const Icon = mode.icon
            const isActive = selectedMode === mode.id
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`
                  relative p-6 rounded-xl transition-all duration-300 transform
                  ${isActive 
                    ? `bg-gradient-to-r ${mode.color} text-white shadow-2xl scale-105` 
                    : 'bg-white/10 text-white hover:bg-white/20 hover:scale-102'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-3">
                  <Icon className={`w-8 h-8 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="font-semibold text-lg">{mode.label}</span>
                </div>
                {isActive && (
                  <div className="absolute inset-0 rounded-xl border-2 border-white/50 pointer-events-none" />
                )}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10">
          {renderContent()}
        </div>
      </div>

      {/* Footer Info */}
      <div className="container mx-auto max-w-5xl px-6 pb-8">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5" /> Chapter Coverage
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-blue-100 text-sm">
            <div>
              <strong className="text-white">Electrostatics:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Coulomb's Law & Electric Field</li>
                <li>Gauss's Law & Applications</li>
                <li>Electric Potential & Capacitance</li>
              </ul>
            </div>
            <div>
              <strong className="text-white">Current Electricity:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Current, Drift Velocity & Ohm's Law</li>
                <li>Resistivity & Temperature Dependence</li>
                <li>Kirchhoff's Laws & Circuit Analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topic_12_phy_ncert
