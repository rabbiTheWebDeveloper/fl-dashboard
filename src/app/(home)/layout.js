/**
 * (home) group layout.
 * The <section> wrapper is replaced with a proper <div> and a skip-target anchor
 * so the landing page sections form a clean DOM tree.
 */
export const metadata = {};   // no additional metadata — root layout handles it

export default function HomeGroupLayout({ children }) {
  return <>{children}</>;
}