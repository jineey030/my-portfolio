import './SectionTitle.css';

interface SectionTitleProps {
  children: string;
}

function SectionTitle({
  children,
}: SectionTitleProps) {
  return (
    <h2 className="ui-section-title">
      <span className="ui-section-title-prefix">
        //
      </span>{' '}
      {children}
    </h2>
  );
}

export default SectionTitle;