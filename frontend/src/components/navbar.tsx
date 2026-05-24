import { useState, useRef, useEffect } from "react";
import { CgArrowLongRight} from "react-icons/cg";
import { GiAbstract084, GiAbstract025 } from "react-icons/gi";

import styles from "../static/css/navbar.module.css";
import Link from "next/link"

function Navbar( { theme = 'default' }) {
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

  if(theme == 'default'){
    return (
      <nav className={styles.nav}>
        <div className={`${styles.text} ` }>
          <GiAbstract084/>
          <p>SCAP</p>
        </div>
  
        <div className={styles.links}>
          <ul className={styles.navLinks}>
            <li><a href="#" className={styles.desktopLink}>DASHBOARD</a></li>
            <li><a href="#" className={styles.desktopLink}>PROFILE</a></li>
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
        <div className={styles.loginSignup}>
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
        </div>
      </nav>
    );
  }else if(theme == 'accent'){
    return (
      <nav className={styles.nav}>
        <div className={`${styles.textA} ${styles.homePage}`}>
          <span><GiAbstract084/></span>
          <p>SCAP</p>
        </div>
  
        <div className={styles.linksA}>
          <ul className={styles.navLinksA}>
            <li><a href="#" className={styles.desktopLinkA}>DASHBOARD</a></li>
            <li><a href="#" className={styles.desktopLinkA}>PROFILE</a></li>
            <li><a href="#" className={styles.desktopLinkA}>EVENTS</a></li>
            <li><a href="#" className={styles.desktopLinkA}>COURSES</a></li>
            <li><a href="#" className={styles.desktopLinkA}>CLASSES</a></li>
          </ul>
          <button className={styles.btn} onClick={() => setOpen(!open)}>☰</button>
  
          <ul className={`${styles.dropDownA} ${open ? styles.open : '' }`}>
            <li><a href="#">DASHBOARD</a></li>
            <li><a href="#">PROFILE</a></li>
            <li><a href="#">EVENTS</a></li>
            <li><a href="#">COURSES</a></li>
            <li><a href="#">CLASSES</a></li>
          </ul>
        </div>
  
        {/* Login/Signup */}
        <div className={styles.loginSignupA}>
          <Link href='/auth'>
          <button ref={btnRef} className={styles.loginSignupBtnA}>
            <span className="font-bold text-lg">Login</span>
            <span className={styles.loginArrowA}><GiAbstract025 /></span>
          </button>
          </Link>
  
          {size.width > 0 && (
            <svg
              className={styles.roundA}
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
        </div>
      </nav>
    );
  }
}

export default Navbar;