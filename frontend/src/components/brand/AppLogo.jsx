import { Link } from 'react-router-dom'
import logoMark from '@/assets/sgtra-mark.svg'
import { brand } from '@/constants/brand'

function AppLogo({ to = '/', compact = false, inverse = false }) {
  const content = (
    <>
      <img src={logoMark} alt="" className="h-8 w-8" />
      <span className={inverse ? 'text-white' : 'text-foreground'}>
        <b className="font-display tracking-tight">{brand.shortName}</b>
        {!compact ? (
          <small
            className={`ml-1 text-[0.65rem] font-medium tracking-wide ${inverse ? 'text-cyan-200' : 'text-primary'}`}
          >
            REFRIGERACIÓN AUTOMOTRIZ
          </small>
        ) : null}
      </span>
    </>
  )
  return to ? (
    <Link to={to} className="inline-flex items-center gap-2" aria-label="SGTRA, ir al inicio">
      {content}
    </Link>
  ) : (
    <span className="inline-flex items-center gap-2">{content}</span>
  )
}

export default AppLogo
