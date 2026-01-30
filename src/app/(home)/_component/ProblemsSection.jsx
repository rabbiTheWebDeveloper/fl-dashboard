import { TrendingDown, ShieldX, PackageX, Boxes, Users, BarChart3, Clock, FolderX } from 'lucide-react';

const problems = [
  {
    icon: TrendingDown,
    title: 'No Profit-Loss Tracking',
    description: "Business is running, but you don't know if you're making profit. Who keeps track of all this manually!",
    color: 'purple',
  },
  {
    icon: ShieldX,
    title: 'Budget Wasted on Fake Orders',
    description: 'Pixel health is down and fake orders drain your ad budget without real sales.',
    color: 'orange',
  },
  {
    icon: PackageX,
    title: 'Return Parcel Issues',
    description: 'No tracking of return parcels, yet losing one parcel means minus profit from 10 sales.',
    color: 'teal',
  },
  {
    icon: Boxes,
    title: 'No Stock Management',
    description: 'No inventory tracking, product not available when orders come in.',
    color: 'pink',
  },
  {
    icon: Users,
    title: 'Team Management Problems',
    description: "Struggling with team management. Hard to tell who's working, who's slacking.",
    color: 'blue',
  },
  {
    icon: BarChart3,
    title: 'No Data Analysis',
    description: "Can't figure out which product is profitable and which is losing money.",
    color: 'green',
  },
  {
    icon: Clock,
    title: "Can't Track Product Profitability",
    description: 'Selling a lot but you can\'t tell which products are actually making profit.',
    color: 'orange',
  },
  {
    icon: Clock,
    title: 'Time Wasted on Manual Work',
    description: 'Time wasted on manual courier entry and repetitive tasks.',
    color: 'teal',
  },
  {
    icon: FolderX,
    title: 'Disorganized Work',
    description: 'No system in place, leading to chaos and missed opportunities.',
    color: 'purple',
  },
];

const colorClasses = {
  purple: 'icon-box-purple',
  orange: 'icon-box-orange',
  teal: 'icon-box-teal',
  pink: 'icon-box-pink',
  blue: 'icon-box-blue',
  green: 'icon-box-green',
};

export const ProblemsSection = () => {
  return (
    <section id="problems" className="py-20 bg-card">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
            Common Problems
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Challenges You Face Daily
          </h2>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              className="group p-6 bg-background rounded-2xl border border-border hover-lift cursor-pointer"
            >
              <div className={`icon-box ${colorClasses[problem.color]} mb-4`}>
                <problem.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
