import styles from './styles.module.scss';
import Image from 'next/image';
import logoSvg from '../../../public/images/logo.svg';
import { SignInButton } from '../SignInButton';

export function Header() {
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Image src={logoSvg} alt="ignews" />
                <nav>
                    <a className={styles.active}>Home</a>
                    <a>Posts</a>
                </nav>
                <SignInButton />
            </div>
        </header>
    );
}