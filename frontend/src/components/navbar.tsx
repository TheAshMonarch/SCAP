import { useState, useRef, useEffect } from "react";
import { CgArrowLongRight} from "react-icons/cg";
import { GiAbstract084, GiAbstract025, GiAbstract080 } from "react-icons/gi";

import styles from "../static/css/navbar.module.css";
import Link from "next/link"

function Navbar( { isLoggedIn, sid }: { isLoggedIn?: boolean; sid: string | undefined}) {

  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0, radius: 10 });

  useEffect(() => {

    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const radius = parseInt(getComputedStyle(btnRef.current).borderRadius);
      setSize({ width: rect.width, height: rect.height, radius });
    }
  }, []);

    return (
      <nav className={styles.nav}>
        <div className={`${styles.text} ` }>
          <GiAbstract084/>
          <p>SCAP</p>
        </div>
  
        <div className={styles.links}>
          <ul className={styles.navLinks}>
            <li><a href="#" className={styles.desktopLink}>DASHBOARD</a></li>
            <li><Link href={`/profile/${sid}`} className={styles.desktopLink}>PROFILE</Link></li>
            <li><a href="#" className={styles.desktopLink}>EVENTS</a></li>
            <li><a href="#" className={styles.desktopLink}>COURSES</a></li>
            <li><a href="#" className={styles.desktopLink}>CLASSES</a></li>
          </ul>
          <button className={styles.btn} onClick={() => setOpen(!open)}>☰</button>
  
          <ul className={`${styles.dropDown} ${open ? styles.open : '' }`}>
            <li><a href="#">DASHBOARD</a></li>
            <li><a href="#">PROFILE</a></li>
            <li><a href="#">EVENTS</a></li>
            <li><a href="#">COURSES</a></li>
            <li><a href="#">CLASSES</a></li>
          </ul>
        </div>
  
        {/* Login/Signup */}
        {!isLoggedIn && <div className={styles.loginSignup}>
          <Link href='/auth'>
          <button ref={btnRef} className={styles.loginSignupBtn}>
            <span className="font-bold text-lg">Login</span>
            <span className={styles.loginArrow}><GiAbstract025 /></span>
          </button>
          </Link>
  
          {size.width > 0 && (
            <svg
              className={styles.round}
              width={size.width}
              height={size.height}
              viewBox={`0 0 ${size.width + 23} ${size.height}`}
            >
              <rect
                x="1"
                y="1"
                width={size.width + 20}
                height={size.height - 2}
                rx={size.radius}
                ry={size.radius}
              />
            </svg>
          )}
        </div>}
          {isLoggedIn && <div className="rounded-full bg-accent-color w-14 h-14 flex items-center justify-center">
            <span className='text-white'><GiAbstract080/></span></div>}
      </nav>
    );
}

export default Navbar;