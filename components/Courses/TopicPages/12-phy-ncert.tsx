import React, { useState } from 'react'
import { FlashcardsResponse, NotesResponse, QuizResponse, StudyMode, DescribeResponse } from '../../../types'
import FlashcardDisplay from '../../Display/FlashcardDisplay'
import NotesDisplay from '../../Display/NotesDisplay'
import QuizDisplay from '../../Display/QuizDisplay'
import { Zap, BookOpen, Brain, FileText, ScanEye } from 'lucide-react'
import DescribeDisplay from '../../Display/DescribeDisplay'
import SimpleTextDisplay from '../../Display/SimpleTextDisplay'
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

const describeData: DescribeResponse = {
  mode: 'describe',
  title: "Visual Analysis: Electrostatics & Circuits",
  key_insights: [
    "Opposite charges create a symmetrical dipole field that density indicates strength.",
    "Dielectric materials polarize to reduce the net electric field, increasing capacitance.",
    "Circuit branches provide alternative pathways, dividing current based on resistance ratios."
  ],
  images: [
    "https://antigravity-artifacts.s3.amazonaws.com/electric_field_lines_visual_1768400472234.png",
    "https://antigravity-artifacts.s3.amazonaws.com/capacitor_diagram_visual_1768400506214.png",
    "https://antigravity-artifacts.s3.amazonaws.com/current_electricity_circuit_visual_1768400533041.png",
    "https://antigravity-artifacts.s3.amazonaws.com/electric_field_lines_visual_1768400472234.png",
    "https://antigravity-artifacts.s3.amazonaws.com/capacitor_diagram_visual_1768400506214.png",
    "https://antigravity-artifacts.s3.amazonaws.com/current_electricity_circuit_visual_1768400533041.png",
    "https://antigravity-artifacts.s3.amazonaws.com/electric_field_lines_visual_1768400472234.png",
    "https://antigravity-artifacts.s3.amazonaws.com/capacitor_diagram_visual_1768400506214.png",
    "https://antigravity-artifacts.s3.amazonaws.com/current_electricity_circuit_visual_1768400533041.png"
  ],
  captions: [
    "Mapping of electric field lines between a positive and negative point charge. The lines represent the direction of force on a positive test charge.",
    "3D model of a parallel plate capacitor featuring a dielectric slab. Notice how the slab alters the field vectors between the plates.",
    "Advanced circuit schematic showing complex current distribution (i1, i2, i3) through a network of resistances connected to a 9V source."
  ],
  sections: [
    {
      heading: "Electric Dipole Geometry",
      content: "The first visual illustrates the classic dipole configuration. Note how the line density is highest directly between the charges, indicating the strongest field region.",
      bullets: [
        "Symmetry around the equatorial plane",
        "Field strength proportional to line density",
        "Flux lines never cross"
      ]
    },
    {
      heading: "Capacitance & Dielectrics",
      content: "The second visual demonstrates the effect of adding a dielectric material (K > 1). The material's internal polarization opposes the external field, effectively allowing more charge storage for the same voltage.",
      bullets: [
        "Induced charges on dielectric surface",
        "Reduction in internal potential difference",
        "Energy density storage mechanics"
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
  const [selectedMode, setSelectedMode] = useState<string>('notes')

  const renderContent = () => {
    switch (selectedMode) {
      case 'flashcards':
        return (
          <FlashcardDisplay
            data={flashcardsData}
            canUseThemes={false}
            onOpenUpgrade={() => { }}
            fullWidth={true}
          />
        )
      case 'notes':
        return <NotesDisplay data={notesData} fullWidth={true} />
      case 'summary':
        return <SimpleTextDisplay data={{ ...notesData, mode: 'summary', bullets: notesData.sections[0].bullets } as any} fullWidth={true} />
      case 'describe':
        return <DescribeDisplay data={describeData} fullWidth={true} />
      default:
        return <NotesDisplay data={notesData} fullWidth={true} />
    }
  }

  const allModes = [
    { id: 'flashcards', icon: Brain, label: 'Flashcards', description: 'Interactive cards' },
    { id: 'notes', icon: BookOpen, label: 'Study Notes', description: 'In-depth notes' },
    { id: 'summary', icon: FileText, label: 'Summary', description: 'Quick recap' },
    { id: 'describe', icon: BookOpen, label: 'Describe', description: 'Detailed view' },
  ]

  return (
    <div className="bg-transparent">
      {/* Header */}
      <div className="theme-bg text-white py-6 md:py-10 px-6 md:px-10 shadow-2xl relative overflow-hidden transition-all duration-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <div className="w-full relative z-10">
          <div className="flex items-center gap-3 md:gap-4 mb-3">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm shadow-inner shrink-0 leading-none">
              <Zap className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-5xl font-black tracking-tighter leading-none truncate mb-1">Physics Class 12</h1>
              <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em] text-white/60">Academic Protocol</p>
            </div>
          </div>
          <h2 className="text-lg md:text-2xl font-black mt-4 opacity-95 tracking-tight leading-tight">Electrostatics & Current Electricity</h2>
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">CBSE NCERT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Chapter 1 & 2</span>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="w-full px-2 md:px-8 py-6 md:py-10">
        <div className="grid grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
          {allModes.map((mode) => {
            const Icon = mode.icon
            const isActive = selectedMode === mode.id
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`
                  relative p-2.5 md:p-5 rounded-xl md:rounded-2xl transition-all duration-300 group
                  ${isActive
                    ? 'theme-bg text-white shadow-xl shadow-theme/20 scale-[1.02]'
                    : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:theme-bg-soft hover:theme-text border border-gray-100 dark:border-white/5'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-1.5 md:gap-3">
                  <Icon className={`w-4 h-4 md:w-6 md:h-6 ${isActive ? 'text-white' : 'group-hover:theme-text'}`} />
                  <span className="font-black text-[8px] md:text-xs uppercase tracking-widest text-center leading-none">{mode.label}</span>
                  <span className={`text-[9px] hidden md:block opacity-60 font-medium uppercase tracking-tighter ${isActive ? 'text-white' : ''}`}>
                    {mode.description}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-[3rem] shadow-2xl p-6 md:p-12 border border-gray-100 dark:border-white/5 overflow-hidden transition-all text-gray-900 dark:text-white">
          {renderContent()}
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full px-4 md:px-10 pb-12">
        <div className="theme-bg-soft rounded-[2rem] p-6 md:p-8 border theme-border">
          <h3 className="theme-text font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Zap size={14} className="theme-text" /> Chapter Coverage
          </h3>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <strong className="text-gray-900 dark:text-white text-sm font-black uppercase tracking-widest block mb-3">Electrostatics</strong>
              <ul className="space-y-2">
                {[
                  "Coulomb's Law & Electric Field",
                  "Gauss's Law & Applications",
                  "Electric Potential & Capacitance"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs md:text-sm text-gray-500 dark:text-slate-400 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full theme-bg opacity-40 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="text-gray-900 dark:text-white text-sm font-black uppercase tracking-widest block mb-3">Current Electricity</strong>
              <ul className="space-y-2">
                {[
                  "Current, Drift Velocity & Ohm's Law",
                  "Resistivity & Temperature Dependence",
                  "Kirchhoff's Laws & Circuit Analysis"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs md:text-sm text-gray-500 dark:text-slate-400 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full theme-bg opacity-40 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topic_12_phy_ncert
