using System.Collections.Generic;

namespace AndcultureCode.GB.Business.Core.Models.Collections
{
    public class OrderedList<TKey, TValue> : IDictionary<TKey, ICollection<TValue>>, IEnumerable<TValue>
    {
        public OrderedList()
        {
            items = new SortedDictionary<TKey, ICollection<TValue>>();
        }

        public OrderedList(IComparer<TKey> comparer)
        {
            items = new SortedDictionary<TKey, ICollection<TValue>>(comparer);
        }

        private IDictionary<TKey, ICollection<TValue>> items;

        public void Add(TKey key, TValue value)
        {
            ICollection<TValue> values;
            if (!items.TryGetValue(key, out values))
            {
                items.Add(key, values = new List<TValue>());
            }
            values.Add(value);
        }

        public void Remove(TKey key, TValue value)
        {
            if (EqualityComparer<TKey>.Default.Equals(key, default(TKey)))
            {
                foreach (var item in items)
                {
                    if (item.Value.Remove(value))
                    {
                        break;
                    }
                }
            }
            else
            {
                if (EqualityComparer<TValue>.Default.Equals(value, default(TValue)))
                    items.Remove(key);
                else
                {
                    ICollection<TValue> values;
                    if (items.TryGetValue(key, out values))
                    {
                        values.Remove(value);
                        if (values.Count == 0)
                            items.Remove(key);
                    }
                }
            }
        }

        public IEnumerator<TValue> GetEnumerator()
        {
            foreach (KeyValuePair<TKey, ICollection<TValue>> values in items)
            {
                foreach (TValue value in values.Value)
                    yield return value;
            }
        }

        #region IDictionary<TKey,IEnumerable<TValue>> Members

        void IDictionary<TKey, ICollection<TValue>>.Add(TKey key, ICollection<TValue> value)
        {
            items.Add(key, value);
        }

        public bool ContainsKey(TKey key)
        {
            return items.ContainsKey(key);
        }

        public ICollection<TKey> Keys
        {
            get { return items.Keys; }
        }

        bool IDictionary<TKey, ICollection<TValue>>.Remove(TKey key)
        {
            return items.Remove(key);
        }

        public bool TryGetValue(TKey key, out ICollection<TValue> value)
        {
            return items.TryGetValue(key, out value);
        }

        ICollection<ICollection<TValue>> IDictionary<TKey, ICollection<TValue>>.Values
        {
            get { return items.Values; }
        }

        public ICollection<TValue> this[TKey key]
        {
            get { return items[key]; }
            set { items[key] = value; }
        }

        #endregion IDictionary<TKey,IEnumerable<TValue>> Members

        #region ICollection<KeyValuePair<TKey,IEnumerable<TValue>>> Members

        void ICollection<KeyValuePair<TKey, ICollection<TValue>>>.Add(KeyValuePair<TKey, ICollection<TValue>> item)
        {
            items.Add(item);
        }

        public void Clear()
        {
            items.Clear();
        }

        bool ICollection<KeyValuePair<TKey, ICollection<TValue>>>.Contains(KeyValuePair<TKey, ICollection<TValue>> item)
        {
            return items.Contains(item);
        }

        void ICollection<KeyValuePair<TKey, ICollection<TValue>>>.CopyTo(KeyValuePair<TKey, ICollection<TValue>>[] array, int arrayIndex)
        {
            items.CopyTo(array, arrayIndex);
        }

        public int Count
        {
            get { return items.Count; }
        }

        public bool IsReadOnly
        {
            get { return items.IsReadOnly; }
        }

        bool ICollection<KeyValuePair<TKey, ICollection<TValue>>>.Remove(KeyValuePair<TKey, ICollection<TValue>> item)
        {
            return items.Remove(item);
        }

        #endregion ICollection<KeyValuePair<TKey,IEnumerable<TValue>>> Members

        #region IEnumerable<KeyValuePair<TKey,IEnumerable<TValue>>> Members

        IEnumerator<KeyValuePair<TKey, ICollection<TValue>>> IEnumerable<KeyValuePair<TKey, ICollection<TValue>>>.GetEnumerator()
        {
            return items.GetEnumerator();
        }

        #endregion IEnumerable<KeyValuePair<TKey,IEnumerable<TValue>>> Members

        #region IEnumerable Members

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return items.GetEnumerator();
        }

        #endregion IEnumerable Members
    }
}
