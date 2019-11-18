import Link from 'next/link';
import { NextPage } from 'next';

const linkStyle = {
  marginRight: 15,
  backgroundColor: 'blue',
  color: 'green'
};

const Header: NextPage<{ t?: string }> = ({ t }) => (
  <header>
    {t}
    <Link href="/">
      <a style={linkStyle}>Home</a>
    </Link>
    <Link href="/about">
      <a style={linkStyle}>About</a>
    </Link>
  </header>
);

export default Header;
