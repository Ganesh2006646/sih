import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Droplets,
  Gauge,
  Layers3,
  MapPin,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
  Waves,
} from 'lucide-react'
import { dams, estimateBreachParams, runSimulation } from './services/mockApi'
import './App.css'
import './map.css'

const featureCards = [
  {
    icon: Layers3,
    title: 'Terrain-aware flood intelligence',
    text: 'Multi-source DEM fusion, drainage-burn processing and floodplain extraction deliver a realistic basin model before any solver begins.',
  },
  {
    icon: Waves,
    title: 'Breach and flow physics',
    text: 'Reservoir routing, breach widening and shallow-water formulations model dam failure, flood-wave travel and downstream depth.',
  },
  {
    icon: MapPin,
    title: 'Impact prioritization',
    text: 'Settlement exposure, roads, cropland and critical facilities are scored to support fast evacuation and emergency coordination.',
  },
  {
    icon: ShieldCheck,
    title: 'Decision-ready reporting',
    text: 'Each run exports hazard layers, hydrograph summaries and operational guidance suited for agency review and field action.',
  },
]

const architecture = [
  { step: '01', title: 'Data ingest', detail: 'CartoDEM, hydrology, terrain masks and historical flood records are assembled for the selected basin.' },
  { step: '02', title: 'Preprocessing', detail: 'DEM cleaning, drainage enforcement, cell classification and breach corridor selection prepare the mesh.' },
  { step: '03', title: 'Physics engine', detail: 'DualSPHysics and 2D shallow-water solver compute breach evolution, flow acceleration and inundation.' },
  { step: '04', title: 'Impact model', detail: 'Exposure overlays estimate affected settlements, critical routes and infrastructure vulnerability.' },
]

const equations = [
  {
    title: 'Continuity / mass balance',
    formula: '∂h/∂t + ∇·(h u) = 0',
    description: 'Conserves water volume across each grid cell while the flood wave propagates downstream.',
  },
  {
    title: 'Momentum transport',
    formula: '∂(h u)/∂t + ∇·(h u u) = -gh ∇z + τ + friction',
    description: 'Captures acceleration, slope-driven momentum and resistance due to terrain and roughness.',
  },
  {
    title: 'Breach progression',
    formula: 'B(t) = B0 + k·Q^m·t^n',
    description: 'Empirical breach widening is tuned using reservoir level, failure mode and breach formation time.',
  },
  {
    title: 'Hydraulic roughness',
    formula: 'Q = (1 / n) A R^(2/3) S^(1/2)',
    description: 'Manning-based channel and floodplain conveyance supports flood routing through varied terrain.',
  },
]

const defaultScenario = {
  mode: 'Overtopping',
  loading: 'Flood-day',
  width: 180,
  depth: 95,
  time: 45,
  slope: 1,
  level: 92,
  tier: 'Full (GPU)',
}

function App() {
  const [selectedDam, setSelectedDam] = useState(dams[0])
  const [scenario, setScenario] = useState(defaultScenario)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(46)

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          setIsRunning(false)
          return 100
        }
        return Math.min(current + 2, 100)
      })
    }, 140)

    return () => clearInterval(timer)
  }, [isRunning])

  const metrics = useMemo(() => {
    const baseDischarge = selectedDam.capacity * 10800 * (scenario.width / 180) * (45 / scenario.time) * (scenario.level / 92)
    const peakDischarge = Math.round(baseDischarge * (scenario.loading === 'Flood-day' ? 1.22 : 0.92))
    const maxDepth = Number(((selectedDam.height / 32) * (scenario.level / 92) * 1.12).toFixed(1))
    const inundatedArea = Math.round(selectedDam.capacity * 6.7 * (0.62 + progress / 180))
    const travelTime = `${(0.7 + progress / 30).toFixed(1)} h`

    return { peakDischarge, maxDepth, inundatedArea, travelTime }
  }, [selectedDam, scenario, progress])

  const setScenarioValue = (key, value) => {
    setScenario((prev) => ({ ...prev, [key]: value }))
  }

  const handleEstimate = async () => {
    const seed = await estimateBreachParams(selectedDam, scenario.mode)
    setScenario((prev) => ({ ...prev, ...seed }))
  }

  const handleRun = async () => {
    setProgress(0)
    setIsRunning(true)
    await runSimulation(selectedDam, scenario, setProgress)
    setProgress(100)
    setIsRunning(false)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark"><Droplets size={18} /></span>
          <div>
            <strong>PRALAY<span>NETRA</span></strong>
            <small>Hydrodynamic dam-break intelligence</small>
          </div>
        </div>

        <div className="status-chip">
          <Radio size={12} /> LIVE SOLVER
        </div>
      </header>

      <main className="dashboard">
        <section className="hero panel">
          <div className="hero-copy">
            <span className="eyebrow">SIH 2026 · PS#1</span>
            <h1>Dam-break inundation modelling for rapid flood response and resilience planning.</h1>
            <p>
              PralayNetra combines terrain analysis, breach physics, hydrodynamic routing and settlement exposure to model how a dam failure evolves across downstream communities.
            </p>

            <div className="cta-row">
              <button type="button" className="primary-btn" onClick={handleRun}>
                Run physics solver <ArrowRight size={16} />
              </button>
              <button type="button" className="ghost-btn" onClick={handleEstimate}>
                <SlidersHorizontal size={16} /> Auto-estimate breach
              </button>
            </div>

            <div className="stats-strip">
              <div className="stat-card">
                <span>Peak discharge</span>
                <strong>{metrics.peakDischarge.toLocaleString()} m³/s</strong>
              </div>
              <div className="stat-card">
                <span>Max depth</span>
                <strong>{metrics.maxDepth.toFixed(1)} m</strong>
              </div>
              <div className="stat-card">
                <span>Flood area</span>
                <strong>{metrics.inundatedArea} km²</strong>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="panel-header compact">
              <div>
                <span className="eyebrow muted">Live model status</span>
                <h2>{selectedDam.name} dam</h2>
              </div>
              <span className="chip success">Hydraulically stable</span>
            </div>

            <div className="mini-grid">
              <div className="mini-card">
                <label>Reservoir</label>
                <strong>{scenario.level}%</strong>
                <small>Operating storage</small>
              </div>
              <div className="mini-card">
                <label>Failure mode</label>
                <strong>{scenario.mode}</strong>
                <small>Empirical seed</small>
              </div>
              <div className="mini-card">
                <label>Travel time</label>
                <strong>{metrics.travelTime}</strong>
                <small>To first settlement</small>
              </div>
              <div className="mini-card">
                <label>Compute tier</label>
                <strong>{scenario.tier}</strong>
                <small>GPU accelerated</small>
              </div>
            </div>

            <div className="progress-block">
              <div className="progress-meta">
                <span>Simulation progress</span>
                <strong>{progress}%</strong>
              </div>
              <div className="progress-track">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </section>

        <section className="feature-grid">
          {featureCards.map(({ icon: Icon, title, text }) => (
            <article key={title} className="feature-card panel">
              <div className="feature-icon"><Icon size={18} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>

        <section className="workspace-grid">
          <div className="panel scenario-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow muted">Scenario configuration</span>
                <h2>Dam selection and hydraulic setup</h2>
              </div>
              <div className="chip subtle">{selectedDam.state}</div>
            </div>

            <div className="dam-list">
              {dams.map((dam) => (
                <button
                  type="button"
                  key={dam.id}
                  className={selectedDam.id === dam.id ? 'dam-option active' : 'dam-option'}
                  onClick={() => setSelectedDam(dam)}
                >
                  <div>
                    <strong>{dam.name}</strong>
                    <small>{dam.river}</small>
                  </div>
                  <span>{dam.height} m</span>
                </button>
              ))}
            </div>

            <div className="controls-grid">
              <div className="section-group">
                <label className="group-label">Failure mechanism</label>
                <div className="toggle-row">
                  {['Overtopping', 'Piping / internal erosion', 'Instantaneous', 'Natural dam breach'].map((mode) => (
                    <button
                      type="button"
                      key={mode}
                      className={scenario.mode === mode ? 'toggle-btn active' : 'toggle-btn'}
                      onClick={() => setScenarioValue('mode', mode)}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="section-group">
                <label className="group-label">Loading case</label>
                <div className="toggle-row narrow">
                  {['Sunny-day', 'Flood-day'].map((caseType) => (
                    <button
                      type="button"
                      key={caseType}
                      className={scenario.loading === caseType ? 'toggle-btn active' : 'toggle-btn'}
                      onClick={() => setScenarioValue('loading', caseType)}
                    >
                      {caseType}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="slider-list">
              {[
                ['width', 'Breach width', 'm', 40, 500],
                ['depth', 'Breach depth', 'm', 20, selectedDam.height],
                ['time', 'Formation time', 'min', 6, 240],
                ['slope', 'Side slope', 'H:V', 0.4, 2],
                ['level', 'Reservoir level', '%', 50, 100],
              ].map(([key, label, unit, min, max]) => (
                <div className="slider-row" key={key}>
                  <div className="slider-head">
                    <span>{label}</span>
                    <strong>
                      {scenario[key]} {unit}
                    </strong>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={key === 'slope' ? 0.1 : 1}
                    value={scenario[key]}
                    onChange={(event) => setScenarioValue(key, Number(event.target.value))}
                  />
                </div>
              ))}
            </div>

            <div className="action-row">
              <button type="button" className="primary-btn compact" onClick={handleRun}>
                <Activity size={16} /> Start simulation
              </button>
              <button type="button" className="secondary-btn" onClick={handleEstimate}>
                <Gauge size={16} /> Refit parameters
              </button>
            </div>
          </div>

          <div className="panel architecture-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow muted">System architecture</span>
                <h2>Modelling pipeline</h2>
              </div>
            </div>

            <div className="architecture-list">
              {architecture.map((item) => (
                <div className="architecture-step" key={item.step}>
                  <div className="step-index">{item.step}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel physics-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow muted">Physics engine</span>
              <h2>Core hydrodynamic equations</h2>
            </div>
            <div className="chip subtle">2D shallow water + particle coupling</div>
          </div>

          <div className="equation-grid">
            {equations.map((equation) => (
              <article className="equation-card" key={equation.title}>
                <h3>{equation.title}</h3>
                <div className="formula">{equation.formula}</div>
                <p>{equation.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="results-grid">
          <div className="panel flood-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow muted">Flood results</span>
                <h2>Downstream inundation envelope</h2>
              </div>
              <div className="chip success">Analysis ready</div>
            </div>

            <div className="flood-visual" aria-label="Stylized inundation map">
              <div className="terrain" />
              <div className="river" />
              <div className="wave" style={{ width: `${32 + progress / 2}%` }} />
              <div className="settlement s1">Rishikesh</div>
              <div className="settlement s2">Haridwar</div>
              <div className="settlement s3">Bijnor</div>
            </div>

            <div className="metrics-row">
              <div className="result-metric">
                <label>Peak discharge</label>
                <strong>{metrics.peakDischarge.toLocaleString()} m³/s</strong>
              </div>
              <div className="result-metric">
                <label>Maximum depth</label>
                <strong>{metrics.maxDepth.toFixed(1)} m</strong>
              </div>
              <div className="result-metric">
                <label>Area inundated</label>
                <strong>{metrics.inundatedArea} km²</strong>
              </div>
            </div>
          </div>

          <div className="panel impact-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow muted">Impact analysis</span>
                <h2>Exposure summary</h2>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Arrival</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Rishikesh', 'T+0:42', 'Extreme'],
                  ['Haridwar', 'T+1:16', 'Extreme'],
                  ['Bijnor', 'T+2:34', 'High'],
                  ['Najibabad', 'T+3:12', 'Moderate'],
                ].map(([location, arrival, risk]) => (
                  <tr key={location}>
                    <td>{location}</td>
                    <td>{arrival}</td>
                    <td>
                      <span className={risk === 'Extreme' ? 'risk extreme' : risk === 'High' ? 'risk high' : 'risk medium'}>{risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="warning-box">
              <div className="warning-icon"><AlertTriangle size={16} /></div>
              <div>
                <strong>Operational note</strong>
                <p>Warning time remains actionable for upstream settlements when the breach is triggered under the current loading case.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
